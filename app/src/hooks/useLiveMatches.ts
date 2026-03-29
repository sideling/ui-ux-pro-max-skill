import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Match } from '../types/models';

const MATCHES_QUERY = `
  *,
  home_team:teams!matches_home_team_id_fkey(*),
  away_team:teams!matches_away_team_id_fkey(*)
`;

async function fetchMatches(): Promise<Match[]> {
  const { data, error } = await supabase
    .from('matches')
    .select(MATCHES_QUERY)
    .order('status', { ascending: false })        // live first
    .order('kickoff_at', { ascending: true });

  if (error) throw error;
  return (data ?? []) as unknown as Match[];
}

export function useLiveMatches() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['matches'],
    queryFn: fetchMatches,
    refetchInterval: 30_000,
  });

  // Subscribe to real-time match updates (score changes, status)
  useEffect(() => {
    const channel = supabase
      .channel('matches-realtime')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'matches' },
        (payload) => {
          queryClient.setQueryData<Match[]>(['matches'], (old) =>
            old?.map((m) =>
              m.id === payload.new.id ? { ...m, ...payload.new } : m
            ) ?? []
          );
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [queryClient]);

  return query;
}
