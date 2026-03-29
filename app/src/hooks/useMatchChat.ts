import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Message } from '../types/models';

const MESSAGE_QUERY = `
  *,
  profile:profiles!messages_user_id_fkey(username, avatar_seed)
`;

async function fetchMessages(matchId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select(MESSAGE_QUERY)
    .eq('match_id', matchId)
    .is('parent_id', null)          // top-level only; replies fetched separately
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) throw error;
  return (data ?? []) as unknown as Message[];
}

export function useMatchChat(matchId: string) {
  const queryClient = useQueryClient();
  const queryKey = ['chat', matchId];

  const query = useQuery({
    queryKey,
    queryFn: () => fetchMessages(matchId),
    enabled: !!matchId,
    staleTime: 0,
  });

  // Subscribe to new messages in this match room
  useEffect(() => {
    if (!matchId) return;

    const channel = supabase
      .channel(`chat-${matchId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `match_id=eq.${matchId}`,
        },
        async (payload) => {
          // Fetch the full message with profile join
          const { data } = await supabase
            .from('messages')
            .select(MESSAGE_QUERY)
            .eq('id', payload.new.id)
            .single();

          if (data && !data.parent_id) {
            queryClient.setQueryData<Message[]>(queryKey, (old) =>
              [data as unknown as Message, ...(old ?? [])]
            );
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          // Update likes/dislikes in place
          queryClient.setQueryData<Message[]>(queryKey, (old) =>
            old?.map((m) =>
              m.id === payload.new.id
                ? { ...m, likes: payload.new.likes, dislikes: payload.new.dislikes }
                : m
            ) ?? []
          );
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [matchId, queryClient]);

  return query;
}

export function useTopComments(matchId: string) {
  return useQuery({
    queryKey: ['top-comments', matchId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('messages')
        .select(MESSAGE_QUERY)
        .eq('match_id', matchId)
        .is('parent_id', null)
        .order('likes', { ascending: false })
        .limit(5);
      if (error) throw error;
      return (data ?? []) as unknown as Message[];
    },
    enabled: !!matchId,
    refetchInterval: 15_000,
  });
}
