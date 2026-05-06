import { NextRequest, NextResponse } from 'next/server';
import { after } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { triggerWorker } from '@/lib/categorization/worker-client';

export const runtime = 'nodejs';
export const maxDuration = 30;

interface Body {
  statement_id?: string;
  scope?: 'unmatched' | 'all';
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

  if (!body.statement_id && !body.scope) {
    return NextResponse.json(
      { error: 'statement_id or scope required' },
      { status: 400 },
    );
  }

  // Build the reset query. RLS pins us to the user; we additionally never
  // overwrite rows the user has manually verified.
  let resetQuery = supabase
    .from('transactions')
    .update({ categorization_status: 'pending' }, { count: 'exact' })
    .eq('user_id', user.id)
    .neq('is_manually_verified', true);

  if (body.statement_id) {
    resetQuery = resetQuery.eq('statement_id', body.statement_id);
  } else if (body.scope === 'unmatched') {
    resetQuery = resetQuery.in('categorization_status', ['unmatched', 'pending']);
  }
  // scope === 'all' has no extra filter — already user-scoped.

  const { count, error: resetErr } = await resetQuery;
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
