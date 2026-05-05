// Vercel-cron drain: re-trigger jobs queued or stuck-in-running. Acts as the
// safety net for lost next/after() invocations.

import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient, triggerWorker } from '@/lib/categorization/worker-client';

export const runtime = 'nodejs';
export const maxDuration = 30;

const STUCK_AFTER_MIN = 5;
const BATCH = 20;

export async function GET(request: NextRequest) {
  // Vercel sets this when invoking via configured cron.
  const isCron = request.headers.get('x-vercel-cron') === '1';
  const isManual =
    request.headers.get('x-worker-secret') === process.env.RAVEN_WORKER_SECRET;
  if (!isCron && !isManual) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const supabase = createServiceRoleClient();
  const stuckBefore = new Date(Date.now() - STUCK_AFTER_MIN * 60_000).toISOString();

  const { data: queued } = await supabase
    .from('categorization_jobs')
    .select('id')
    .eq('status', 'queued')
    .order('created_at', { ascending: true })
    .limit(BATCH);

  const { data: stuck } = await supabase
    .from('categorization_jobs')
    .select('id')
    .eq('status', 'running')
    .lt('claimed_at', stuckBefore)
    .order('created_at', { ascending: true })
    .limit(BATCH);

  // Reset stuck jobs back to queued so the worker will accept them.
  if (stuck && stuck.length > 0) {
    await supabase
      .from('categorization_jobs')
      .update({ status: 'queued', claimed_at: null })
      .in(
        'id',
        stuck.map((j) => j.id),
      );
  }

  const ids = [...(queued ?? []), ...(stuck ?? [])].map((j) => j.id as string);
  for (const id of ids) {
    // Fire-and-forget; each invocation is independent.
    triggerWorker(id);
  }

  return NextResponse.json({ ok: true, triggered: ids.length });
}
