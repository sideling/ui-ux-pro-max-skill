import { useMutation } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { supabase } from '../lib/supabase';
import { useChatStore } from '../stores/chatStore';
import { useAuthStore } from '../stores/authStore';

export function useVote() {
  const { setOptimisticVote, optimisticVotes } = useChatStore();
  const { userId } = useAuthStore();

  const mutation = useMutation({
    mutationFn: async ({
      messageId,
      value,
    }: {
      messageId: string;
      value: 1 | -1;
    }) => {
      const uid = userId();
      if (!uid) throw new Error('Not authenticated');

      const existing = optimisticVotes[messageId];
      const isSameVote = existing === value;

      if (isSameVote) {
        // Toggle off — delete vote
        await supabase
          .from('votes')
          .delete()
          .eq('message_id', messageId)
          .eq('user_id', uid);
        setOptimisticVote(messageId, null);
      } else {
        // Upsert vote
        await supabase
          .from('votes')
          .upsert({ message_id: messageId, user_id: uid, value });
        setOptimisticVote(messageId, value);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    },
  });

  return mutation;
}

export function useSendMessage(matchId: string) {
  const { markSent, canSend, replyTarget, clearReplyTarget } = useChatStore();
  const { userId } = useAuthStore();

  return useMutation({
    mutationFn: async (body: string) => {
      if (!canSend()) throw new Error('Cooldown active');
      const uid = userId();
      if (!uid) throw new Error('Not authenticated');

      const { error } = await supabase.from('messages').insert({
        match_id: matchId,
        user_id: uid,
        body: body.trim(),
        parent_id: replyTarget?.id ?? null,
      });

      if (error) throw error;
      markSent();
      clearReplyTarget();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    },
  });
}
