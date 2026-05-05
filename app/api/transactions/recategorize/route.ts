// Re-runs the sharded-raven pipeline against existing transactions, either
// scoped to a statement (most common) or to an explicit txn id list.

import { NextRequest, NextResponse } from 'next/server';
import { after } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { triggerWorker } from '@/lib/categorization/worker-client';

export const runtime = 'nodejs';
export const maxDuration = 30;

interface Body {
  statement_id?: string;
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: userErr } = await supabase.auth.getUser();
  if (userErr || !user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  if (!body.statement_id) {
    return NextResponse.json({ error: 'statement_id required' }, { status: 400 });
  }

  // Reset target rows to 'pending' so the pipeline reprocesses them. RLS
  // ensures we can only touch rows owned by the user. Never overwrite
  // user-verified rows.
  const { count, error: resetErr } = await supabase
    .from('transactions')
    .update({ categorization_status: 'pending' }, { count: 'exact' })
    .eq('user_id', user.id)
    .eq('statement_id', body.statement_id)
    .neq('is_manually_verified', true);
  if (resetErr) {
    return NextResponse.json({ error: resetErr.message }, { status: 500 });
  }
  const resetCount = count ?? 0;

  if (resetCount === 0) {
    return NextResponse.json({ ok: true, reset: 0, job_id: null });
  }

  const { data: job, error: jobErr } = await supabase
    .from('categorization_jobs')
    .insert({
      user_id: user.id,
      statement_id: body.statement_id ?? null,
      status: 'queued',
    })
    .select('id')
    .single();

  if (jobErr || !job) {
    return NextResponse.json(
      { error: 'failed to enqueue', detail: jobErr?.message },
      { status: 500 },
    );
  }

  const jobId = job.id as string;
  after(async () => {
    await triggerWorker(jobId);
  });

  return NextResponse.json({ ok: true, reset: resetCount, job_id: jobId });
}
