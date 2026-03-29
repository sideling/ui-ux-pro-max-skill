import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Fonts, TypeScale } from '../../constants/typography';
import { Spacing, Radius, MIN_TOUCH } from '../../constants/layout';
import { Avatar } from '../ui/Avatar';
import { PressableScale } from '../ui/PressableScale';
import { useChatStore } from '../../stores/chatStore';
import { useVote } from '../../hooks/useVote';
import type { Message } from '../../types/models';

interface MessageBubbleProps {
  message: Message;
  isTop?: boolean;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-AU', {
    hour: '2-digit', minute: '2-digit', hour12: true,
  });
}

export const MessageBubble = memo(function MessageBubble({ message, isTop }: MessageBubbleProps) {
  const { setReplyTarget, optimisticVotes } = useChatStore();
  const { mutate: vote } = useVote();

  const currentVote = optimisticVotes[message.id] ?? null;
  const displayName = message.profile?.username ?? 'Fan';
  const seed = message.profile?.avatar_seed ?? displayName;

  // Optimistic like/dislike counts
  const likes = message.likes + (currentVote === 1 ? (currentVote === 1 ? 0 : 1) : 0);
  const dislikes = message.dislikes;

  return (
    <View style={[styles.container, isTop && styles.topContainer]}>
      {isTop && (
        <View style={styles.topBadge}>
          <Ionicons name="trophy" size={10} color={Colors.accent} />
          <Text style={styles.topBadgeText}>TOP</Text>
        </View>
      )}

      <View style={styles.row}>
        <Avatar seed={seed} username={message.profile?.username ?? null} size={32} />

        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.username}>{displayName}</Text>
            <Text style={styles.time}>{formatTime(message.created_at)}</Text>
          </View>

          {/* Body */}
          <Text style={styles.body}>{message.body}</Text>

          {/* Actions */}
          <View style={styles.actions}>
            {/* Like */}
            <PressableScale
              onPress={() => vote({ messageId: message.id, value: 1 })}
              style={[styles.voteBtn, currentVote === 1 && styles.voteBtnActive]}
              scaleTo={0.9}
              haptic={false}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 4 }}
            >
              <Ionicons
                name={currentVote === 1 ? 'thumbs-up' : 'thumbs-up-outline'}
                size={14}
                color={currentVote === 1 ? Colors.positive : Colors.foregroundMuted}
              />
              <Text style={[styles.voteCount, currentVote === 1 && styles.voteCountPositive]}>
                {message.likes + (currentVote === 1 ? 1 : 0)}
              </Text>
            </PressableScale>

            {/* Dislike */}
            <PressableScale
              onPress={() => vote({ messageId: message.id, value: -1 })}
              style={[styles.voteBtn, currentVote === -1 && styles.voteBtnNegative]}
              scaleTo={0.9}
              haptic={false}
              hitSlop={{ top: 8, bottom: 8, left: 4, right: 8 }}
            >
              <Ionicons
                name={currentVote === -1 ? 'thumbs-down' : 'thumbs-down-outline'}
                size={14}
                color={currentVote === -1 ? Colors.negative : Colors.foregroundMuted}
              />
            </PressableScale>

            {/* Reply */}
            <PressableScale
              onPress={() =>
                setReplyTarget({ id: message.id, body: message.body, username: displayName })
              }
              style={styles.replyBtn}
              scaleTo={0.9}
              haptic={false}
              hitSlop={{ top: 8, bottom: 8, left: 4, right: 8 }}
            >
              <Ionicons name="return-down-forward-outline" size={14} color={Colors.foregroundMuted} />
              <Text style={styles.replyText}>Reply</Text>
            </PressableScale>
          </View>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[2],
  },
  topContainer: {
    backgroundColor: Colors.accentDim,
    borderLeftWidth: 2,
    borderLeftColor: Colors.accent,
    borderRadius: Radius.md,
    marginHorizontal: Spacing[4],
    paddingHorizontal: Spacing[3],
  },
  topBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: Spacing[1],
  },
  topBadgeText: {
    fontFamily: Fonts.uiBold,
    fontSize: TypeScale.xs,
    color: Colors.accent,
    letterSpacing: 0.6,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing[3],
  },
  content: {
    flex: 1,
    gap: Spacing[1],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
  username: {
    fontFamily: Fonts.uiSemiBold,
    fontSize: TypeScale.sm,
    color: Colors.foreground,
  },
  time: {
    fontFamily: Fonts.ui,
    fontSize: TypeScale.xs,
    color: Colors.foregroundSubtle,
  },
  body: {
    fontFamily: Fonts.ui,
    fontSize: TypeScale.base,
    color: Colors.foreground,
    lineHeight: TypeScale.base * 1.5,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    marginTop: Spacing[1],
  },
  voteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    minHeight: MIN_TOUCH,
    paddingVertical: Spacing[1],
  },
  voteBtnActive: {},
  voteBtnNegative: {},
  voteCount: {
    fontFamily: Fonts.ui,
    fontSize: TypeScale.xs,
    color: Colors.foregroundMuted,
  },
  voteCountPositive: {
    color: Colors.positive,
  },
  replyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    minHeight: MIN_TOUCH,
    paddingVertical: Spacing[1],
  },
  replyText: {
    fontFamily: Fonts.ui,
    fontSize: TypeScale.xs,
    color: Colors.foregroundMuted,
  },
});
