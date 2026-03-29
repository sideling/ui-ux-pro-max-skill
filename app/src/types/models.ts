export type MatchStatus = 'upcoming' | 'live' | 'fulltime';

export interface Team {
  id: number;
  slug: string;
  name: string;
  short_name: string;
  logo_url: string | null;
  primary_color: string;
}

export interface Match {
  id: string;
  home_team: Team;
  away_team: Team;
  home_score: number;
  away_score: number;
  status: MatchStatus;
  match_minute: number | null;
  kickoff_at: string;
  venue: string | null;
  round: number;
  season: number;
  active_users: number;
}

export interface Profile {
  id: string;
  username: string | null;
  avatar_seed: string;
  total_likes: number;
  created_at: string;
}

export interface Message {
  id: string;
  match_id: string;
  user_id: string;
  parent_id: string | null;
  body: string;
  likes: number;
  dislikes: number;
  created_at: string;
  profile: Pick<Profile, 'username' | 'avatar_seed'> | null;
  // client-side optimistic state
  userVote?: 1 | -1 | null;
  replies?: Message[];
}

export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  username: string | null;
  avatar_seed: string;
  total_likes: number;
}

export interface LadderTeam {
  position: number;
  team: Team;
  played: number;
  won: number;
  lost: number;
  drawn: number;
  points: number;
  for: number;
  against: number;
  diff: number;
}
