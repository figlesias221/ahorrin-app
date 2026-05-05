// Helpers shared by enqueue (upload route, recategorize) and drain (cron).

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export function createServiceRoleClient(): SupabaseClient {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

export function workerSecret(): string {
  const s = process.env.RAVEN_WORKER_SECRET;
  if (!s) throw new Error('RAVEN_WORKER_SECRET env var not configured');
  return s;
}

function selfBaseUrl(): string {
  return (
    process.env.RAVEN_SELF_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    'http://localhost:3000'
  );
}

export async function triggerWorker(jobId: string): Promise<void> {
  const url = `${selfBaseUrl()}/api/jobs/categorize`;
  try {
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Worker-Secret': workerSecret(),
      },
      body: JSON.stringify({ job_id: jobId }),
      // Fire-and-forget; the cron drain is the safety net.
      cache: 'no-store',
    });
  } catch (err) {
    // Swallow — the cron drain will pick it up. Surface in logs only.
    console.warn('[raven] failed to trigger worker', { jobId, err });
  }
}
