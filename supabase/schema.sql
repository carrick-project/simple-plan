-- Run this once in the Supabase SQL editor for this project.
-- Stores one row per signed-in user, holding their whole planner state.

create table if not exists planner_state (
  user_id uuid primary key references auth.users (id) on delete cascade,
  tasks jsonb not null default '[]',
  habits jsonb not null default '[]',
  notes jsonb not null default '[]',
  settings jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

alter table planner_state enable row level security;

create policy "Users can read their own planner state"
  on planner_state for select
  using (auth.uid() = user_id);

create policy "Users can insert their own planner state"
  on planner_state for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own planner state"
  on planner_state for update
  using (auth.uid() = user_id);
