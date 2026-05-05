// Sharded-raven categorization worker.
//
// Invoked by:
//   - upload route via next/after() right after responding to the client
//   - /api/jobs/drain (Vercel cron) for retry / lost-trigger recovery
//   - /api/transactions/recategorize for manual reprocess
//
// Auth: shared-secret header. No user cookie is involved.

import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient, workerSecret } from '@/lib/categorization/worker-client';
import { runPipelineForStatement } from '@/lib/categorization/pipeline';

export const runtime = 'nodejs';
export const maxDuration = 60;

const RETRY_MAX = parseInt(process.env.RAVEN_RETRY_MAX ?? '3', 10);

export async function POST(request: NextRequest) {
  if (request.headers.get('x-worker-secret') !== workerSecret()) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  let body: { job_id?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }
  if (!body.job_id) {
    return NextResponse.json({ error: 'job_id required' }, { status: 400 });
  }

  const supabase = createServiceRoleClient();

  // Atomically claim the job: only the first caller wins.
  const { data: claimed, error: claimErr } = await supabase
    .from('categorization_jobs')
    .update({ status: 'running', claimed_at: new Date().toISOString() })
    .eq('id', body.job_id)
    .in('status', ['queued', 'running'])
    .select('id, user_id, statement_id, attempts')
    .single();

  if (claimErr || !claimed) {
    return NextResponse.json(
      { ok: false, reason: 'not-claimable', detail: claimErr?.message },
      { status: 200 },
    );
  }

  // Mark statement as categorizing for the UI.
  if (claimed.statement_id) {
    await supabase
      .from('bank_statements')
      .update({ status: 'categorizing' })
      .eq('id', claimed.statement_id);
  }

  try {
    const counts = claimed.statement_id
      ? await runPipelineForStatement(
          supabase,
          claimed.user_id as string,
          claimed.statement_id as string,
        )
      : { rules: 0, cache: 0, similar: 0, unmatched: 0, total: 0 };

    if (claimed.statement_id) {
      await supabase
        .from('bank_statements')
        .update({ status: 'completed', transactions_count: counts.total })
        .eq('id', claimed.statement_id);
    }

    await supabase
      .from('categorization_jobs')
      .update({
        status: 'done',
        last_error: null,
        shard_count: 1,
      })
      .eq('id', claimed.id);

    return NextResponse.json({ ok: true, counts });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const attempts = (claimed.attempts as number) + 1;
    const dead = attempts >= RETRY_MAX;

    await supabase
      .from('categorization_jobs')
      .update({
        status: dead ? 'dead' : 'queued',
        attempts,
        last_error: msg.slice(0, 1000),
        claimed_at: null,
      })
      .eq('id', claimed.id);

    if (dead && claimed.statement_id) {
      await supabase
        .from('bank_statements')
        .update({ status: 'failed' })
        .eq('id', claimed.statement_id);
    }

    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
