import React, { useState } from 'react';
import {
  StyleSheet, View, Text, FlatList,
  Pressable, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import { Fonts, TypeScale } from '../../src/constants/typography';
import { Spacing, Radius } from '../../src/constants/layout';
import { Avatar } from '../../src/components/ui/Avatar';
import { useLeaderboard, type LeaderboardPeriod } from '../../src/hooks/useLeaderboard';
import { useAuthStore } from '../../src/stores/authStore';
import type { LeaderboardEntry } from '../../src/types/models';

const PERIODS: { key: LeaderboardPeriod; label: string }[] = [
  { key: 'all', label: 'All Time' },
  { key: 'weekly', label: 'This Week' },
  { key: 'daily', label: 'Today' },
];

function RankMedal({ rank }: { rank: number }) {
  if (rank === 1) return <Ionicons name="trophy" size={16} color="#FFD700" />;
  if (rank === 2) return <Ionicons name="trophy" size={16} color="#C0C0C0" />;
  if (rank === 3) return <Ionicons name="trophy" size={16} color="#CD7F32" />;
  return <Text style={styles.rankNum}>#{rank}</Text>;
}

function LeaderboardRow({ entry, isMe }: { entry: LeaderboardEntry; isMe: boolean }) {
  return (
    <View style={[styles.row, isMe && styles.rowMe]}>
      <View style={styles.rankCol}>
        <RankMedal rank={entry.rank} />
      </View>
      <Avatar seed={entry.avatar_seed} username={entry.username} size={36} />
      <View style={styles.nameCol}>
        <Text style={styles.username} numberOfLines={1}>
          {entry.username ?? 'Anonymous Fan'}
          {isMe && <Text style={styles.youTag}> (you)</Text>}
        </Text>
      </View>
      <View style={styles.likesCol}>
        <Ionicons name="thumbs-up" size={12} color={Colors.positive} />
        <Text style={styles.likesCount}>{entry.total_likes.toLocaleString()}</Text>
      </View>
    </View>
  );
}

export default function LeaderboardScreen() {
  const insets = useSafeAreaInsets();
  const [period, setPeriod] = useState<LeaderboardPeriod>('all');
  const { data, isLoading, isError } = useLeaderboard(period);
  const { userId } = useAuthStore();
  const myId = userId();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>RANKINGS</Text>
        <Text style={styles.subtitle}>Top commenters by likes received</Text>
      </View>

      {/* Period tabs */}
      <View style={styles.tabs}>
        {PERIODS.map((p) => (
          <Pressable
            key={p.key}
            onPress={() => setPeriod(p.key)}
            style={[styles.tab, period === p.key && styles.tabActive]}
          >
            <Text style={[styles.tabText, period === p.key && styles.tabTextActive]}>
              {p.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={Colors.accent} />
        </View>
      ) : isError ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>Failed to load rankings</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.user_id}
          renderItem={({ item }) => (
            <LeaderboardRow entry={item} isMe={item.user_id === myId} />
          )}
          ItemSeparatorComponent={() => (
            <View style={styles.divider} />
          )}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>No data yet — start commenting!</Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgDeep,
  },
  header: {
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[3],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  title: {
    fontFamily: Fonts.display,
    fontSize: TypeScale['2xl'],
    color: Colors.foreground,
  },
  subtitle: {
    fontFamily: Fonts.ui,
    fontSize: TypeScale.sm,
    color: Colors.foregroundMuted,
    marginTop: 2,
  },
  tabs: {
    flexDirection: 'row',
    padding: Spacing[4],
    gap: Spacing[2],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing[2],
    paddingHorizontal: Spacing[3],
    borderRadius: Radius.pill,
    backgroundColor: Colors.surface,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: Colors.accentDim,
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  tabText: {
    fontFamily: Fonts.uiMedium,
    fontSize: TypeScale.sm,
    color: Colors.foregroundMuted,
  },
  tabTextActive: {
    color: Colors.accent,
  },
  list: {
    paddingBottom: Spacing[10],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
  },
  rowMe: {
    backgroundColor: Colors.accentDim,
  },
  rankCol: {
    width: 28,
    alignItems: 'center',
  },
  rankNum: {
    fontFamily: Fonts.uiBold,
    fontSize: TypeScale.sm,
    color: Colors.foregroundMuted,
  },
  nameCol: {
    flex: 1,
  },
  username: {
    fontFamily: Fonts.uiMedium,
    fontSize: TypeScale.base,
    color: Colors.foreground,
  },
  youTag: {
    fontFamily: Fonts.ui,
    fontSize: TypeScale.sm,
    color: Colors.accent,
  },
  likesCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  likesCount: {
    fontFamily: Fonts.uiBold,
    fontSize: TypeScale.sm,
    color: Colors.positive,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing[4],
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing[8],
  },
  errorText: {
    fontFamily: Fonts.ui,
    fontSize: TypeScale.base,
    color: Colors.negative,
  },
  emptyText: {
    fontFamily: Fonts.ui,
    fontSize: TypeScale.base,
    color: Colors.foregroundMuted,
    textAlign: 'center',
  },
});
