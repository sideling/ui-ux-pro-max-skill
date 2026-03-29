-- ============================================================
-- NRL LIVE — SUPABASE SCHEMA
-- Run in Supabase SQL Editor
-- ============================================================

create extension if not exists "uuid-ossp";

-- ============================================================
-- TEAMS
-- ============================================================
create table public.teams (
  id           serial primary key,
  slug         text unique not null,
  name         text not null,
  short_name   text not null,          -- 3-letter code e.g. 'BRI'
  logo_url     text,
  primary_color text not null default '#ffffff'
);

-- ============================================================
-- MATCHES
-- ============================================================
create table public.matches (
  id              uuid primary key default uuid_generate_v4(),
  home_team_id    int  not null references public.teams(id),
  away_team_id    int  not null references public.teams(id),
  home_score      int  not null default 0,
  away_score      int  not null default 0,
  status          text not null default 'upcoming'
                  check (status in ('upcoming', 'live', 'fulltime')),
  match_minute    int,
  kickoff_at      timestamptz not null,
  venue           text,
  round           int not null,
  season          int not null default 2026,
  active_users    int not null default 0,
  created_at      timestamptz not null default now()
);
create index idx_matches_status on public.matches(status, kickoff_at);
create index idx_matches_season  on public.matches(season, round);

-- ============================================================
-- PROFILES (extends auth.users)
-- ============================================================
create table public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  username     text unique,
  avatar_seed  text not null default '',
  total_likes  int  not null default 0,
  created_at   timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, avatar_seed)
  values (new.id, encode(gen_random_bytes(4), 'hex'));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- MESSAGES
-- ============================================================
create table public.messages (
  id          uuid primary key default uuid_generate_v4(),
  match_id    uuid not null references public.matches(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  parent_id   uuid references public.messages(id) on delete set null,
  body        text not null check (char_length(body) between 1 and 500),
  likes       int  not null default 0,
  dislikes    int  not null default 0,
  created_at  timestamptz not null default now()
);
create index idx_messages_match_time on public.messages(match_id, created_at desc);
create index idx_messages_top        on public.messages(match_id, likes desc) where parent_id is null;

-- ============================================================
-- VOTES
-- ============================================================
create table public.votes (
  message_id  uuid not null references public.messages(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  value       smallint not null check (value in (1, -1)),
  created_at  timestamptz not null default now(),
  primary key (message_id, user_id)
);

-- Trigger: update likes/dislikes on messages when a vote is inserted/updated/deleted
create or replace function public.sync_vote_counts()
returns trigger language plpgsql security definer as $$
begin
  if TG_OP = 'DELETE' then
    update public.messages set
      likes    = (select count(*) from public.votes where message_id = old.message_id and value = 1),
      dislikes = (select count(*) from public.votes where message_id = old.message_id and value = -1)
    where id = old.message_id;
  else
    update public.messages set
      likes    = (select count(*) from public.votes where message_id = new.message_id and value = 1),
      dislikes = (select count(*) from public.votes where message_id = new.message_id and value = -1)
    where id = new.message_id;

    -- Update profile total_likes when someone gets a like
    if new.value = 1 then
      update public.profiles set total_likes = total_likes + 1
      where id = (select user_id from public.messages where id = new.message_id);
    end if;
  end if;
  return null;
end;
$$;

create trigger on_vote_change
  after insert or update or delete on public.votes
  for each row execute function public.sync_vote_counts();

-- ============================================================
-- NRL LADDER (static, updated manually / via edge function)
-- ============================================================
create table public.ladder (
  id         serial primary key,
  season     int  not null default 2026,
  team_id    int  not null references public.teams(id),
  position   int  not null,
  played     int  not null default 0,
  won        int  not null default 0,
  lost       int  not null default 0,
  drawn      int  not null default 0,
  points     int  not null default 0,
  pts_for    int  not null default 0,
  pts_against int not null default 0,
  unique(season, team_id)
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles  enable row level security;
alter table public.matches    enable row level security;
alter table public.messages   enable row level security;
alter table public.votes      enable row level security;
alter table public.teams      enable row level security;
alter table public.ladder     enable row level security;

-- Teams & Matches & Ladder — public read
create policy "teams_read"   on public.teams   for select using (true);
create policy "matches_read" on public.matches  for select using (true);
create policy "ladder_read"  on public.ladder   for select using (true);

-- Profiles — public read, owner write
create policy "profiles_read"   on public.profiles for select using (true);
create policy "profiles_update" on public.profiles for update using (auth.uid() = id);

-- Messages — public read, authenticated insert (own rows only)
create policy "messages_read"   on public.messages for select using (true);
create policy "messages_insert" on public.messages for insert with check (auth.uid() = user_id);
create policy "messages_delete" on public.messages for delete using (auth.uid() = user_id);

-- Votes — authenticated users only, own rows
create policy "votes_read"   on public.votes for select using (auth.uid() = user_id);
create policy "votes_upsert" on public.votes for insert with check (auth.uid() = user_id);
create policy "votes_update" on public.votes for update using (auth.uid() = user_id);
create policy "votes_delete" on public.votes for delete using (auth.uid() = user_id);

-- ============================================================
-- ENABLE REALTIME
-- ============================================================
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.matches;
