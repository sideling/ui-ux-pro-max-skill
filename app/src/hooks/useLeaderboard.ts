import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { LeaderboardEntry } from '../types/models';

export type LeaderboardPeriod = 'all' | 'weekly' | 'daily';

async function fetchLeaderboard(period: LeaderboardPeriod): Promise<LeaderboardEntry[]> {
  if (period === 'all') {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, avatar_seed, total_likes')
      .order('total_likes', { ascending: false })
      .limit(50);

    if (error) throw error;

    return (data ?? []).map((p, i) => ({
      rank: i + 1,
      user_id: p.id,
      username: p.username,
      avatar_seed: p.avatar_seed,
      total_likes: p.total_likes,
    }));
  }

  // For weekly/daily — count votes in the period
  const since = period === 'daily'
    ? new Date(Date.now() - 24 * 60 * 60_000).toISOString()
    : new Date(Date.now() - 7 * 24 * 60 * 60_000).toISOString();

  const { data, error } = await supabase
    .from('votes')
    .select('message_id, messages!inner(user_id, profiles!inner(username, avatar_seed))')
    .eq('value', 1)
    .gte('created_at', since);

  if (error) throw error;

  // Aggregate by user
  const counts: Record<string, { username: string | null; avatar_seed: string; count: number }> = {};
  for (const v of data ?? []) {
    const msg = (v as any).messages;
    const profile = msg?.profiles;
    const uid: string = msg?.user_id;
    if (!uid) continue;
    if (!counts[uid]) {
      counts[uid] = { username: profile?.username ?? null, avatar_seed: profile?.avatar_seed ?? '', count: 0 };
    }
    counts[uid].count++;
  }

  return Object.entries(counts)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 50)
    .map(([uid, info], i) => ({
      rank: i + 1,
      user_id: uid,
      username: info.username,
      avatar_seed: info.avatar_seed,
      total_likes: info.count,
    }));
}

export function useLeaderboard(period: LeaderboardPeriod) {
  return useQuery({
    queryKey: ['leaderboard', period],
    queryFn: () => fetchLeaderboard(period),
    staleTime: 60_000,
  });
}
