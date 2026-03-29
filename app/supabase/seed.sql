-- ============================================================
-- NRL LIVE — SEED DATA (2026 Season Round 1)
-- ============================================================

-- Teams
insert into public.teams (slug, name, short_name, primary_color) values
  ('broncos',    'Brisbane Broncos',          'BRI', '#800000'),
  ('roosters',   'Sydney Roosters',           'SYD', '#000033'),
  ('storm',      'Melbourne Storm',           'MEL', '#460063'),
  ('panthers',   'Penrith Panthers',          'PEN', '#003087'),
  ('rabbitohs',  'South Sydney Rabbitohs',    'SOU', '#007A3D'),
  ('sharks',     'Cronulla-Sutherland Sharks', 'CRO', '#009EE2'),
  ('sea-eagles', 'Manly-Warringah Sea Eagles', 'MAN', '#4B0082'),
  ('tigers',     'Wests Tigers',              'WST', '#FF7F00'),
  ('bulldogs',   'Canterbury-Bankstown Bulldogs', 'CBY', '#003DA5'),
  ('dragons',    'St George Illawarra Dragons', 'SGI', '#CE1126'),
  ('warriors',   'New Zealand Warriors',      'NZW', '#000000'),
  ('raiders',    'Canberra Raiders',          'CAN', '#6ABF4B'),
  ('cowboys',    'North Queensland Cowboys',  'NQC', '#003087'),
  ('titans',     'Gold Coast Titans',         'GCT', '#0099CC'),
  ('eels',       'Parramatta Eels',           'PAR', '#003DA5'),
  ('knights',    'Newcastle Knights',         'NEW', '#002B5C')
on conflict (slug) do nothing;

-- Matches (Round 1 — mix of live, upcoming, fulltime for dev testing)
insert into public.matches (home_team_id, away_team_id, home_score, away_score, status, match_minute, kickoff_at, venue, round, season)
values
  -- Live match
  (
    (select id from teams where slug='broncos'),
    (select id from teams where slug='roosters'),
    18, 12, 'live', 65,
    now() - interval '65 minutes',
    'Suncorp Stadium', 1, 2026
  ),
  -- Live match 2
  (
    (select id from teams where slug='storm'),
    (select id from teams where slug='panthers'),
    6, 10, 'live', 42,
    now() - interval '42 minutes',
    'AAMI Park', 1, 2026
  ),
  -- Upcoming
  (
    (select id from teams where slug='rabbitohs'),
    (select id from teams where slug='sharks'),
    0, 0, 'upcoming', null,
    now() + interval '2 hours',
    'Accor Stadium', 1, 2026
  ),
  (
    (select id from teams where slug='sea-eagles'),
    (select id from teams where slug='tigers'),
    0, 0, 'upcoming', null,
    now() + interval '4 hours',
    '4 Pines Park', 1, 2026
  ),
  -- Fulltime
  (
    (select id from teams where slug='bulldogs'),
    (select id from teams where slug='dragons'),
    22, 16, 'fulltime', null,
    now() - interval '3 hours',
    'Accor Stadium', 1, 2026
  );

-- Ladder (Round 1 standings — zeroed out for fresh season)
insert into public.ladder (season, team_id, position, played, won, lost, drawn, points, pts_for, pts_against)
select 2026, id, row_number() over (order by id), 0, 0, 0, 0, 0, 0, 0
from public.teams
on conflict (season, team_id) do nothing;
