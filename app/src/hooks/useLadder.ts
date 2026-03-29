import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { LadderTeam } from '../types/models';

export function useLadder(season = 2026) {
  return useQuery({
    queryKey: ['ladder', season],
    queryFn: async (): Promise<LadderTeam[]> => {
      const { data, error } = await supabase
        .from('ladder')
        .select('*, team:teams(*)')
        .eq('season', season)
        .order('position', { ascending: true });

      if (error) throw error;

      return (data ?? []).map((row: any) => ({
        position: row.position,
        team: row.team,
        played: row.played,
        won: row.won,
        lost: row.lost,
        drawn: row.drawn,
        points: row.points,
        for: row.pts_for,
        against: row.pts_against,
        diff: row.pts_for - row.pts_against,
      }));
    },
    staleTime: 5 * 60_000,
  });
}
