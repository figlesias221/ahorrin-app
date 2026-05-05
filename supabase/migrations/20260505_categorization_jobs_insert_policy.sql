-- Allow users to enqueue their own categorization jobs.
-- The original sharded-raven migration created only a SELECT policy on
-- categorization_jobs (the worker uses service role), but the
-- /api/transactions/recategorize endpoint runs as the user and needs INSERT.

drop policy if exists "users insert own jobs" on categorization_jobs;
create policy "users insert own jobs" on categorization_jobs
  for insert with check (auth.uid() = user_id);
