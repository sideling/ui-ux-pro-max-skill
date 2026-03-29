import React, { useCallback } from 'react';
import {
  StyleSheet, View, Text, FlatList,
  ActivityIndicator, Pressable,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import { Fonts, TypeScale } from '../../src/constants/typography';
import { Spacing } from '../../src/constants/layout';
import { useMatchChat } from '../../src/hooks/useMatchChat';
import { useLiveMatches } from '../../src/hooks/useLiveMatches';
import { MessageBubble } from '../../src/components/chat/MessageBubble';
import { MessageInput } from '../../src/components/chat/MessageInput';
import { TopCommentsStrip } from '../../src/components/chat/TopCommentsStrip';
import { LiveBadge } from '../../src/components/ui/LiveBadge';
import type { Message } from '../../src/types/models';

export default function MatchChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();

  const { data: messages, isLoading } = useMatchChat(id);
  const { data: matches } = useLiveMatches();
  const match = matches?.find((m) => m.id === id);

  const renderMessage = useCallback(
    ({ item }: { item: Message }) => <MessageBubble message={item} />,
    []
  );

  const keyExtractor = useCallback((item: Message) => item.id, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backBtn}
          hitSlop={12}
        >
          <Ionicons name="chevron-back" size={22} color={Colors.foreground} />
        </Pressable>

        {match ? (
          <View style={styles.matchInfo}>
            <Text style={styles.matchTitle} numberOfLines={1}>
              {match.home_team.short_name} vs {match.away_team.short_name}
            </Text>
            <View style={styles.matchMeta}>
              {match.status === 'live' ? (
                <>
                  <LiveBadge />
                  <Text style={styles.score}>
                    {match.home_score} – {match.away_score}
                  </Text>
                  {match.match_minute != null && (
                    <Text style={styles.minute}>{match.match_minute}'</Text>
                  )}
                </>
              ) : (
                <Text style={styles.statusText}>
                  {match.status === 'fulltime' ? `FT ${match.home_score}–${match.away_score}` : 'Upcoming'}
                </Text>
              )}
              <View style={styles.activeUsers}>
                <Ionicons name="people" size={11} color={Colors.foregroundMuted} />
                <Text style={styles.activeUsersText}>{match.active_users}</Text>
              </View>
            </View>
          </View>
        ) : (
          <Text style={styles.matchTitle}>Match Chat</Text>
        )}
      </View>

      {/* Top Comments */}
      <TopCommentsStrip matchId={id} />

      {/* Messages */}
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={Colors.accent} />
        </View>
      ) : (
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={keyExtractor}
          inverted
          contentContainerStyle={styles.messageList}
          maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
          windowSize={10}
          maxToRenderPerBatch={20}
          removeClippedSubviews
          ItemSeparatorComponent={() => <View style={{ height: Spacing[1] }} />}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="chatbubble-outline" size={40} color={Colors.foregroundSubtle} />
              <Text style={styles.emptyTitle}>Be the first to react</Text>
              <Text style={styles.emptyBody}>
                {match?.status === 'live'
                  ? 'The match is live — share your thoughts!'
                  : 'Chat opens when the match kicks off.'}
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Message input */}
      <MessageInput matchId={id} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgDeep,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchInfo: {
    flex: 1,
    gap: 3,
  },
  matchTitle: {
    fontFamily: Fonts.display,
    fontSize: TypeScale.md,
    color: Colors.foreground,
  },
  matchMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
  score: {
    fontFamily: Fonts.display,
    fontSize: TypeScale.base,
    color: Colors.foreground,
  },
  minute: {
    fontFamily: Fonts.ui,
    fontSize: TypeScale.xs,
    color: Colors.live,
  },
  statusText: {
    fontFamily: Fonts.uiBold,
    fontSize: TypeScale.xs,
    color: Colors.foregroundMuted,
    letterSpacing: 0.4,
  },
  activeUsers: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  activeUsersText: {
    fontFamily: Fonts.ui,
    fontSize: TypeScale.xs,
    color: Colors.foregroundMuted,
  },
  messageList: {
    paddingVertical: Spacing[2],
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing[8],
    gap: Spacing[3],
    transform: [{ scaleY: -1 }],   // FlatList is inverted
  },
  emptyTitle: {
    fontFamily: Fonts.display,
    fontSize: TypeScale.lg,
    color: Colors.foregroundMuted,
    textAlign: 'center',
  },
  emptyBody: {
    fontFamily: Fonts.ui,
    fontSize: TypeScale.sm,
    color: Colors.foregroundSubtle,
    textAlign: 'center',
    lineHeight: TypeScale.sm * 1.5,
  },
});
