import { NextRequest, NextResponse } from 'next/server';
import { after } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { triggerWorker } from '@/lib/categorization/worker-client';
import { runPipelineForUserPending } from '@/lib/categorization/pipeline';

export const runtime = 'nodejs';
export const maxDuration = 60;

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
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }

  if (!body.statement_id && !body.scope) {
    return NextResponse.json(
      { error: 'Especificá un extracto o un alcance' },
      { status: 400 },
    );
  }

  // RLS pins us to the user; never overwrite manually-verified rows.
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

  const { count, error: resetErr } = await resetQuery;
  if (resetErr) {
    return NextResponse.json({ error: resetErr.message }, { status: 500 });
  }
  const resetCount = count ?? 0;

  if (resetCount === 0) {
    return NextResponse.json({ ok: true, reset: 0, job_id: null });
  }

  // Statement-scoped: enqueue + async worker. The UI subscribes to Realtime
  // for that statement and shows progress as it completes.
  if (body.statement_id) {
    const { data: job, error: jobErr } = await supabase
      .from('categorization_jobs')
      .insert({
        user_id: user.id,
        statement_id: body.statement_id,
        status: 'queued',
      })
      .select('id')
      .single();

    if (jobErr || !job) {
      return NextResponse.json(
        { error: 'No se pudo encolar el trabajo', detail: jobErr?.message },
        { status: 500 },
      );
    }

    const jobId = job.id as string;
    after(async () => {
      await triggerWorker(jobId);
    });

    return NextResponse.json({ ok: true, reset: resetCount, job_id: jobId, async: true });
  }

  // User-scoped (scope='unmatched' or 'all'): run the pipeline inline so the
  // user sees the actual outcome instead of a "queued" placeholder. Pipeline
  // works with the user-scoped client (RLS pins everything to user_id).
  try {
    const counts = await runPipelineForUserPending(supabase, user.id);
    return NextResponse.json({
      ok: true,
      reset: resetCount,
      job_id: null,
      async: false,
      counts,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
