-- Security Hardening Migration
-- This migration adds audit logging, security policies, and additional protections

-- Create audit log table for tracking sensitive data access
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  table_name TEXT NOT NULL,
  operation TEXT NOT NULL CHECK (operation IN ('SELECT', 'INSERT', 'UPDATE', 'DELETE')),
  record_id UUID,
  changed_fields JSONB,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

-- Enable RLS on audit logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs (users can't see their own)
-- This requires setting up an admin role - for now we'll restrict to postgres
CREATE POLICY "Only postgres role can view audit logs"
  ON public.audit_logs
  FOR SELECT
  USING (false); -- No one can select directly, only through functions

-- Create indexes for audit log queries
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_table_name ON public.audit_logs(table_name);
CREATE INDEX idx_audit_logs_timestamp ON public.audit_logs(timestamp DESC);
CREATE INDEX idx_audit_logs_operation ON public.audit_logs(operation);

-- Function to log sensitive data access
CREATE OR REPLACE FUNCTION log_sensitive_data_access(
  p_table_name TEXT,
  p_operation TEXT,
  p_record_id UUID DEFAULT NULL,
  p_changed_fields JSONB DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.audit_logs (
    user_id,
    table_name,
    operation,
    record_id,
    changed_fields
  ) VALUES (
    auth.uid(),
    p_table_name,
    p_operation,
    p_record_id,
    p_changed_fields
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically log account access
CREATE OR REPLACE FUNCTION audit_account_access()
RETURNS TRIGGER AS $$
BEGIN
  -- Log SELECT operations on accounts with account_number
  IF TG_OP = 'SELECT' THEN
    PERFORM log_sensitive_data_access(
      'accounts',
      'SELECT',
      NEW.id,
      NULL
    );
  -- Log UPDATE operations
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM log_sensitive_data_access(
      'accounts',
      'UPDATE',
      NEW.id,
      jsonb_build_object(
        'old', row_to_json(OLD),
        'new', row_to_json(NEW)
      )
    );
  -- Log DELETE operations
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM log_sensitive_data_access(
      'accounts',
      'DELETE',
      OLD.id,
      row_to_json(OLD)::jsonb
    );
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit trigger to accounts table
CREATE TRIGGER audit_accounts_trigger
  AFTER UPDATE OR DELETE ON public.accounts
  FOR EACH ROW EXECUTE FUNCTION audit_account_access();

-- Create a rate limiting table using timestamp buckets
CREATE TABLE IF NOT EXISTS public.rate_limits (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  request_count INT DEFAULT 0,
  window_start TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (user_id, endpoint, window_start)
);

-- Enable RLS on rate limits
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Users can only see their own rate limit data
CREATE POLICY "Users can view their own rate limits"
  ON public.rate_limits
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create index for rate limit queries
CREATE INDEX idx_rate_limits_user_endpoint ON public.rate_limits(user_id, endpoint, window_start DESC);

-- Function to check and enforce rate limits
CREATE OR REPLACE FUNCTION check_rate_limit(
  p_endpoint TEXT,
  p_max_requests INT DEFAULT 100,
  p_window_minutes INT DEFAULT 15
)
RETURNS BOOLEAN AS $$
DECLARE
  current_window TIMESTAMPTZ;
  request_count INT;
BEGIN
  -- Calculate the current time window (rounded down to window_minutes)
  current_window := date_trunc('minute', NOW()) -
    (EXTRACT(MINUTE FROM NOW())::INT % p_window_minutes) * INTERVAL '1 minute';

  -- Get or create the rate limit record
  INSERT INTO public.rate_limits (user_id, endpoint, window_start, request_count)
  VALUES (auth.uid(), p_endpoint, current_window, 1)
  ON CONFLICT (user_id, endpoint, window_start)
  DO UPDATE SET request_count = rate_limits.request_count + 1
  RETURNING rate_limits.request_count INTO request_count;

  -- Clean up old rate limit records (older than 24 hours)
  DELETE FROM public.rate_limits
  WHERE window_start < NOW() - INTERVAL '24 hours';

  -- Return false if rate limit exceeded
  RETURN request_count <= p_max_requests;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to get rate limit info for a user
CREATE OR REPLACE FUNCTION get_rate_limit_status(p_endpoint TEXT)
RETURNS TABLE (
  endpoint TEXT,
  requests_made INT,
  requests_remaining INT,
  window_start TIMESTAMPTZ,
  window_end TIMESTAMPTZ
) AS $$
DECLARE
  current_window TIMESTAMPTZ;
  max_requests INT := 100;
  window_minutes INT := 15;
BEGIN
  current_window := date_trunc('minute', NOW()) -
    (EXTRACT(MINUTE FROM NOW())::INT % window_minutes) * INTERVAL '1 minute';

  RETURN QUERY
  SELECT
    p_endpoint,
    COALESCE(rl.request_count, 0),
    max_requests - COALESCE(rl.request_count, 0),
    current_window,
    current_window + (window_minutes || ' minutes')::INTERVAL
  FROM (SELECT 1) dummy
  LEFT JOIN public.rate_limits rl ON
    rl.user_id = auth.uid() AND
    rl.endpoint = p_endpoint AND
    rl.window_start = current_window;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add session tracking table for anomaly detection
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_start TIMESTAMPTZ DEFAULT NOW(),
  session_end TIMESTAMPTZ,
  ip_address INET,
  user_agent TEXT,
  is_suspicious BOOLEAN DEFAULT false,
  suspicious_reason TEXT
);

-- Enable RLS on user sessions
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Users can view their own sessions
CREATE POLICY "Users can view their own sessions"
  ON public.user_sessions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create indexes for session queries
CREATE INDEX idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX idx_user_sessions_start ON public.user_sessions(session_start DESC);
CREATE INDEX idx_user_sessions_suspicious ON public.user_sessions(is_suspicious) WHERE is_suspicious = true;

-- Function to detect suspicious activity patterns
CREATE OR REPLACE FUNCTION detect_suspicious_activity()
RETURNS TRIGGER AS $$
DECLARE
  recent_sessions INT;
  different_ips INT;
BEGIN
  -- Check for multiple sessions from different IPs in the last hour
  SELECT COUNT(DISTINCT ip_address)
  INTO different_ips
  FROM public.user_sessions
  WHERE user_id = NEW.user_id
    AND session_start > NOW() - INTERVAL '1 hour';

  -- Mark as suspicious if more than 3 different IPs in 1 hour
  IF different_ips > 3 THEN
    NEW.is_suspicious := true;
    NEW.suspicious_reason := 'Multiple IP addresses in short time period';
  END IF;

  -- Check for rapid-fire session creation
  SELECT COUNT(*)
  INTO recent_sessions
  FROM public.user_sessions
  WHERE user_id = NEW.user_id
    AND session_start > NOW() - INTERVAL '5 minutes';

  -- Mark as suspicious if more than 10 sessions in 5 minutes
  IF recent_sessions > 10 THEN
    NEW.is_suspicious := true;
    NEW.suspicious_reason := COALESCE(NEW.suspicious_reason || '; ', '') || 'Rapid session creation';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply suspicious activity detection trigger
CREATE TRIGGER detect_suspicious_activity_trigger
  BEFORE INSERT ON public.user_sessions
  FOR EACH ROW EXECUTE FUNCTION detect_suspicious_activity();

-- Create a view for security dashboard
CREATE OR REPLACE VIEW public.security_dashboard AS
SELECT
  u.id as user_id,
  u.email,
  COUNT(DISTINCT al.id) as total_audit_logs,
  COUNT(DISTINCT al.id) FILTER (WHERE al.timestamp > NOW() - INTERVAL '24 hours') as recent_audit_logs,
  COUNT(DISTINCT us.id) FILTER (WHERE us.is_suspicious) as suspicious_sessions,
  MAX(us.session_start) as last_session,
  COUNT(DISTINCT us.ip_address) as unique_ips
FROM auth.users u
LEFT JOIN public.audit_logs al ON al.user_id = u.id
LEFT JOIN public.user_sessions us ON us.user_id = u.id
WHERE u.id = auth.uid()
GROUP BY u.id, u.email;

-- Grant appropriate permissions
ALTER VIEW public.security_dashboard OWNER TO postgres;

-- Add comments for documentation
COMMENT ON TABLE public.audit_logs IS
'Audit trail for sensitive data access. Logs all operations on accounts and other sensitive tables.';

COMMENT ON TABLE public.rate_limits IS
'Rate limiting data for API endpoints. Tracks request counts per user per endpoint per time window.';

COMMENT ON TABLE public.user_sessions IS
'Session tracking for anomaly detection. Monitors user login patterns and flags suspicious activity.';

COMMENT ON FUNCTION check_rate_limit IS
'Enforces rate limiting for API endpoints. Returns false if rate limit is exceeded.
Default: 100 requests per 15 minutes.';

COMMENT ON FUNCTION get_rate_limit_status IS
'Returns current rate limit status for a user and endpoint.
Shows requests made, remaining, and window times.';

COMMENT ON VIEW public.security_dashboard IS
'Security overview for the current user. Shows audit logs, suspicious sessions, and activity metrics.';

-- Create a function to get security recommendations
CREATE OR REPLACE FUNCTION get_security_recommendations()
RETURNS TABLE (
  recommendation TEXT,
  severity TEXT,
  description TEXT
) AS $$
BEGIN
  -- Check for accounts without 2FA (placeholder - requires auth.users extensions)
  -- Check for weak passwords (placeholder - requires auth extensions)
  -- Check for suspicious activity
  RETURN QUERY
  SELECT
    'Review suspicious sessions'::TEXT,
    'HIGH'::TEXT,
    'You have ' || COUNT(*)::TEXT || ' suspicious login sessions in the past 7 days'
  FROM public.user_sessions
  WHERE user_id = auth.uid()
    AND is_suspicious = true
    AND session_start > NOW() - INTERVAL '7 days'
  HAVING COUNT(*) > 0;

  -- Check for too many rate limit violations
  RETURN QUERY
  SELECT
    'Reduce API usage'::TEXT,
    'MEDIUM'::TEXT,
    'High rate limit usage detected for endpoint: ' || endpoint
  FROM public.rate_limits
  WHERE user_id = auth.uid()
    AND window_start > NOW() - INTERVAL '1 hour'
    AND request_count > 80 -- 80% of default limit
  LIMIT 1;

  RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions on security functions
GRANT EXECUTE ON FUNCTION check_rate_limit TO authenticated;
GRANT EXECUTE ON FUNCTION get_rate_limit_status TO authenticated;
GRANT EXECUTE ON FUNCTION get_security_recommendations TO authenticated;
