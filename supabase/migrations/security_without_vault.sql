-- Security Enhancement Migration (WITHOUT Vault)
-- This migration adds security features that don't require Supabase Vault extension

-- ============================================================================
-- 1. MODIFY ACCOUNTS TABLE FOR APP-LEVEL ENCRYPTION
-- ============================================================================

-- Add columns for encrypted account numbers
ALTER TABLE public.accounts
  ADD COLUMN IF NOT EXISTS account_number_encrypted TEXT,
  ADD COLUMN IF NOT EXISTS account_number_hash TEXT, -- For searching
  ADD COLUMN IF NOT EXISTS account_number_last4 TEXT; -- For display

-- Create index on hash for efficient lookup
CREATE INDEX IF NOT EXISTS idx_accounts_number_hash
  ON public.accounts(account_number_hash);

-- Update trigger to clear plaintext when encrypted is set
CREATE OR REPLACE FUNCTION ensure_account_security()
RETURNS TRIGGER AS $$
BEGIN
  -- If encrypted version is set, clear the plaintext
  IF NEW.account_number_encrypted IS NOT NULL AND NEW.account_number_encrypted != '' THEN
    NEW.account_number := NULL;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_account_security_trigger
  BEFORE INSERT OR UPDATE ON public.accounts
  FOR EACH ROW EXECUTE FUNCTION ensure_account_security();

-- ============================================================================
-- 2. AUDIT LOGGING
-- ============================================================================

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

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy: No direct access to audit logs (admin only via functions)
CREATE POLICY "Restrict audit log access"
  ON public.audit_logs
  FOR SELECT
  USING (false);

-- Indexes for audit queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id
  ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_name
  ON public.audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp
  ON public.audit_logs(timestamp DESC);

-- Function to log sensitive operations
CREATE OR REPLACE FUNCTION log_sensitive_operation(
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

-- Trigger for account modifications
CREATE OR REPLACE FUNCTION audit_account_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    PERFORM log_sensitive_operation(
      'accounts',
      'UPDATE',
      NEW.id,
      jsonb_build_object(
        'old_name', OLD.name,
        'new_name', NEW.name,
        'old_bank', OLD.bank,
        'new_bank', NEW.bank,
        'has_encrypted', NEW.account_number_encrypted IS NOT NULL
      )
    );
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM log_sensitive_operation(
      'accounts',
      'DELETE',
      OLD.id,
      jsonb_build_object('name', OLD.name, 'bank', OLD.bank)
    );
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS audit_accounts_trigger ON public.accounts;
CREATE TRIGGER audit_accounts_trigger
  AFTER UPDATE OR DELETE ON public.accounts
  FOR EACH ROW EXECUTE FUNCTION audit_account_changes();

-- ============================================================================
-- 3. RATE LIMITING
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.rate_limits (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  request_count INT DEFAULT 0,
  window_start TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (user_id, endpoint, window_start)
);

ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own rate limits"
  ON public.rate_limits
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_rate_limits_lookup
  ON public.rate_limits(user_id, endpoint, window_start DESC);

-- Rate limiting function
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
  -- Calculate current time window
  current_window := date_trunc('minute', NOW()) -
    (EXTRACT(MINUTE FROM NOW())::INT % p_window_minutes) * INTERVAL '1 minute';

  -- Insert or update rate limit record
  INSERT INTO public.rate_limits (user_id, endpoint, window_start, request_count)
  VALUES (auth.uid(), p_endpoint, current_window, 1)
  ON CONFLICT (user_id, endpoint, window_start)
  DO UPDATE SET request_count = rate_limits.request_count + 1
  RETURNING rate_limits.request_count INTO request_count;

  -- Clean up old records
  DELETE FROM public.rate_limits
  WHERE window_start < NOW() - INTERVAL '24 hours';

  RETURN request_count <= p_max_requests;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get rate limit status
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

-- ============================================================================
-- 4. SESSION TRACKING
-- ============================================================================

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

ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own sessions"
  ON public.user_sessions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id
  ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_start
  ON public.user_sessions(session_start DESC);
CREATE INDEX IF NOT EXISTS idx_user_sessions_suspicious
  ON public.user_sessions(is_suspicious)
  WHERE is_suspicious = true;

-- Detect suspicious activity
CREATE OR REPLACE FUNCTION detect_suspicious_activity()
RETURNS TRIGGER AS $$
DECLARE
  different_ips INT;
  recent_sessions INT;
BEGIN
  -- Check for multiple IPs
  SELECT COUNT(DISTINCT ip_address)
  INTO different_ips
  FROM public.user_sessions
  WHERE user_id = NEW.user_id
    AND session_start > NOW() - INTERVAL '1 hour';

  IF different_ips > 3 THEN
    NEW.is_suspicious := true;
    NEW.suspicious_reason := 'Multiple IP addresses detected';
  END IF;

  -- Check for rapid sessions
  SELECT COUNT(*)
  INTO recent_sessions
  FROM public.user_sessions
  WHERE user_id = NEW.user_id
    AND session_start > NOW() - INTERVAL '5 minutes';

  IF recent_sessions > 10 THEN
    NEW.is_suspicious := true;
    NEW.suspicious_reason := COALESCE(NEW.suspicious_reason || '; ', '') ||
                              'Rapid session creation';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS detect_suspicious_activity_trigger ON public.user_sessions;
CREATE TRIGGER detect_suspicious_activity_trigger
  BEFORE INSERT ON public.user_sessions
  FOR EACH ROW EXECUTE FUNCTION detect_suspicious_activity();

-- ============================================================================
-- 5. SECURITY DASHBOARD
-- ============================================================================

CREATE OR REPLACE VIEW public.security_dashboard AS
SELECT
  auth.uid() as user_id,
  COUNT(DISTINCT al.id) as total_audit_logs,
  COUNT(DISTINCT al.id) FILTER (
    WHERE al.timestamp > NOW() - INTERVAL '24 hours'
  ) as recent_audit_logs,
  COUNT(DISTINCT us.id) FILTER (
    WHERE us.is_suspicious
  ) as suspicious_sessions,
  MAX(us.session_start) as last_session,
  COUNT(DISTINCT us.ip_address) as unique_ips
FROM auth.users u
LEFT JOIN public.audit_logs al ON al.user_id = u.id
LEFT JOIN public.user_sessions us ON us.user_id = u.id
WHERE u.id = auth.uid()
GROUP BY u.id;

-- ============================================================================
-- 6. HELPER FUNCTIONS
-- ============================================================================

-- Find account by hash (for encrypted lookups)
CREATE OR REPLACE FUNCTION find_account_by_hash(p_hash TEXT)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  name TEXT,
  bank TEXT,
  account_number_last4 TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    a.id,
    a.user_id,
    a.name,
    a.bank,
    a.account_number_last4
  FROM public.accounts a
  WHERE a.user_id = auth.uid()
    AND a.account_number_hash = p_hash;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Security recommendations
CREATE OR REPLACE FUNCTION get_security_recommendations()
RETURNS TABLE (
  recommendation TEXT,
  severity TEXT,
  description TEXT
) AS $$
BEGIN
  -- Check for suspicious sessions
  RETURN QUERY
  SELECT
    'Review suspicious sessions'::TEXT,
    'HIGH'::TEXT,
    'You have ' || COUNT(*)::TEXT || ' suspicious sessions in the past 7 days'
  FROM public.user_sessions
  WHERE user_id = auth.uid()
    AND is_suspicious = true
    AND session_start > NOW() - INTERVAL '7 days'
  HAVING COUNT(*) > 0;

  -- Check for high rate limit usage
  RETURN QUERY
  SELECT
    'Reduce API usage'::TEXT,
    'MEDIUM'::TEXT,
    'High rate limit usage detected for: ' || endpoint
  FROM public.rate_limits
  WHERE user_id = auth.uid()
    AND window_start > NOW() - INTERVAL '1 hour'
    AND request_count > 80
  LIMIT 1;

  RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 7. GRANT PERMISSIONS
-- ============================================================================

GRANT EXECUTE ON FUNCTION check_rate_limit TO authenticated;
GRANT EXECUTE ON FUNCTION get_rate_limit_status TO authenticated;
GRANT EXECUTE ON FUNCTION get_security_recommendations TO authenticated;
GRANT EXECUTE ON FUNCTION find_account_by_hash TO authenticated;

-- ============================================================================
-- 8. COMMENTS
-- ============================================================================

COMMENT ON TABLE public.audit_logs IS
'Audit trail for sensitive operations';

COMMENT ON TABLE public.rate_limits IS
'Rate limiting per user per endpoint';

COMMENT ON TABLE public.user_sessions IS
'Session tracking with anomaly detection';

COMMENT ON FUNCTION check_rate_limit IS
'Check and enforce rate limits. Returns false if exceeded.';

COMMENT ON VIEW public.security_dashboard IS
'Security overview for current user';
