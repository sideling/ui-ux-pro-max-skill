import { create } from 'zustand';

const COOLDOWN_MS = 5000;

interface ChatState {
  // Cooldown
  lastSentAt: number | null;
  cooldownRemaining: () => number; // ms remaining
  canSend: () => boolean;
  markSent: () => void;

  // Reply target
  replyTarget: { id: string; body: string; username: string | null } | null;
  setReplyTarget: (target: ChatState['replyTarget']) => void;
  clearReplyTarget: () => void;

  // Optimistic votes: messageId -> vote (1 | -1 | null)
  optimisticVotes: Record<string, 1 | -1 | null>;
  setOptimisticVote: (messageId: string, vote: 1 | -1 | null) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  lastSentAt: null,
  cooldownRemaining: () => {
    const { lastSentAt } = get();
    if (!lastSentAt) return 0;
    const elapsed = Date.now() - lastSentAt;
    return Math.max(0, COOLDOWN_MS - elapsed);
  },
  canSend: () => get().cooldownRemaining() === 0,
  markSent: () => set({ lastSentAt: Date.now() }),

  replyTarget: null,
  setReplyTarget: (target) => set({ replyTarget: target }),
  clearReplyTarget: () => set({ replyTarget: null }),

  optimisticVotes: {},
  setOptimisticVote: (messageId, vote) =>
    set((s) => ({
      optimisticVotes: { ...s.optimisticVotes, [messageId]: vote },
    })),
}));

export const COOLDOWN_MS_EXPORT = COOLDOWN_MS;
