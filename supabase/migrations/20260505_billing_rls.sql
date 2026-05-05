-- Harden RLS on billing tables (subscriptions, usage_tracking, plans).
-- Idempotent: safe to re-run.

alter table if exists public.subscriptions enable row level security;
alter table if exists public.usage_tracking enable row level security;
alter table if exists public.plans enable row level security;

-- subscriptions: each user can only see/modify their own row.
drop policy if exists "subscriptions_select_own" on public.subscriptions;
create policy "subscriptions_select_own" on public.subscriptions
  for select using (auth.uid() = user_id);

drop policy if exists "subscriptions_insert_own" on public.subscriptions;
create policy "subscriptions_insert_own" on public.subscriptions
  for insert with check (auth.uid() = user_id);

drop policy if exists "subscriptions_update_own" on public.subscriptions;
create policy "subscriptions_update_own" on public.subscriptions
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "subscriptions_delete_own" on public.subscriptions;
create policy "subscriptions_delete_own" on public.subscriptions
  for delete using (auth.uid() = user_id);

-- usage_tracking: same per-user isolation.
drop policy if exists "usage_tracking_select_own" on public.usage_tracking;
create policy "usage_tracking_select_own" on public.usage_tracking
  for select using (auth.uid() = user_id);

drop policy if exists "usage_tracking_insert_own" on public.usage_tracking;
create policy "usage_tracking_insert_own" on public.usage_tracking
  for insert with check (auth.uid() = user_id);

drop policy if exists "usage_tracking_update_own" on public.usage_tracking;
create policy "usage_tracking_update_own" on public.usage_tracking
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- plans: shared catalog. Readable by everyone (anon + authenticated). No writes via API.
drop policy if exists "plans_select_all" on public.plans;
create policy "plans_select_all" on public.plans
  for select using (true);
