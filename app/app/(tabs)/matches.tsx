import React from 'react';
import {
  StyleSheet, View, Text, FlatList,
  RefreshControl, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../src/constants/colors';
import { Fonts, TypeScale } from '../../src/constants/typography';
import { Spacing } from '../../src/constants/layout';
import { useLiveMatches } from '../../src/hooks/useLiveMatches';
import { MatchCard } from '../../src/components/matches/MatchCard';
import type { Match } from '../../src/types/models';

export default function MatchesScreen() {
  const insets = useSafeAreaInsets();
  const { data: matches, isLoading, isError, refetch, isRefetching } = useLiveMatches();

  const liveMatches = matches?.filter((m) => m.status === 'live') ?? [];
  const otherMatches = matches?.filter((m) => m.status !== 'live') ?? [];

  const sections: Array<{ type: 'header'; title: string } | { type: 'match'; match: Match }> = [
    ...(liveMatches.length > 0 ? [
      { type: 'header' as const, title: `🔴 LIVE NOW — ${liveMatches.length} MATCH${liveMatches.length > 1 ? 'ES' : ''}` },
      ...liveMatches.map((m) => ({ type: 'match' as const, match: m })),
    ] : []),
    ...(otherMatches.length > 0 ? [
      { type: 'header' as const, title: 'UPCOMING & RECENT' },
      ...otherMatches.map((m) => ({ type: 'match' as const, match: m })),
    ] : []),
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>NRL LIVE</Text>
        <Text style={styles.subtitle}>Round {matches?.[0]?.round ?? '—'} · 2026</Text>
      </View>

      {isLoading && !matches ? (
        <View style={styles.center}>
          <ActivityIndicator color={Colors.accent} />
        </View>
      ) : isError ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>Failed to load matches</Text>
        </View>
      ) : (
        <FlatList
          data={sections}
          keyExtractor={(item, i) =>
            item.type === 'header' ? `h-${i}` : item.match.id
          }
          renderItem={({ item }) => {
            if (item.type === 'header') {
              return <Text style={styles.sectionHeader}>{item.title}</Text>;
            }
            return <MatchCard match={item.match} />;
          }}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={Colors.accent}
            />
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>No matches scheduled today</Text>
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
  list: {
    padding: Spacing[4],
    paddingBottom: Spacing[10],
  },
  separator: {
    height: Spacing[3],
  },
  sectionHeader: {
    fontFamily: Fonts.uiBold,
    fontSize: TypeScale.xs,
    color: Colors.foregroundMuted,
    letterSpacing: 0.8,
    marginBottom: Spacing[3],
    marginTop: Spacing[2],
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
