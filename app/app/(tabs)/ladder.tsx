import React from 'react';
import {
  StyleSheet, View, Text,
  FlatList, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../src/constants/colors';
import { Fonts, TypeScale } from '../../src/constants/typography';
import { Spacing } from '../../src/constants/layout';
import { useLadder } from '../../src/hooks/useLadder';
import type { LadderTeam } from '../../src/types/models';

function LadderHeader() {
  return (
    <View style={styles.headerRow}>
      <Text style={[styles.headerCell, styles.posCell]}>#</Text>
      <Text style={[styles.headerCell, styles.teamCell]}>TEAM</Text>
      <Text style={styles.headerCell}>P</Text>
      <Text style={styles.headerCell}>W</Text>
      <Text style={styles.headerCell}>L</Text>
      <Text style={styles.headerCell}>D</Text>
      <Text style={[styles.headerCell, styles.ptsCell]}>PTS</Text>
    </View>
  );
}

function LadderRow({ team }: { team: LadderTeam }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.cell, styles.posCell, styles.posText]}>{team.position}</Text>
      <View style={styles.teamCell}>
        <View style={[styles.teamDot, { backgroundColor: team.team.primary_color }]} />
        <Text style={styles.teamName} numberOfLines={1}>{team.team.name}</Text>
      </View>
      <Text style={styles.cell}>{team.played}</Text>
      <Text style={[styles.cell, styles.wonText]}>{team.won}</Text>
      <Text style={[styles.cell, styles.lostText]}>{team.lost}</Text>
      <Text style={styles.cell}>{team.drawn}</Text>
      <Text style={[styles.cell, styles.ptsCell, styles.ptsText]}>{team.points}</Text>
    </View>
  );
}

export default function LadderScreen() {
  const insets = useSafeAreaInsets();
  const { data, isLoading, isError } = useLadder();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>NRL LADDER</Text>
        <Text style={styles.subtitle}>2026 Season</Text>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={Colors.accent} />
        </View>
      ) : isError ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>Failed to load ladder</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => String(item.team.id)}
          ListHeaderComponent={<LadderHeader />}
          stickyHeaderIndices={[0]}
          renderItem={({ item }) => <LadderRow team={item} />}
          ItemSeparatorComponent={() => <View style={styles.divider} />}
          contentContainerStyle={styles.list}
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
    paddingBottom: Spacing[10],
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[2],
    backgroundColor: Colors.bgElevated,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  headerCell: {
    fontFamily: Fonts.uiBold,
    fontSize: TypeScale.xs,
    color: Colors.foregroundMuted,
    letterSpacing: 0.5,
    width: 32,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
  },
  cell: {
    fontFamily: Fonts.ui,
    fontSize: TypeScale.sm,
    color: Colors.foreground,
    width: 32,
    textAlign: 'center',
  },
  posCell: {
    width: 28,
  },
  posText: {
    color: Colors.foregroundMuted,
    fontFamily: Fonts.uiBold,
  },
  teamCell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
  teamDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  teamName: {
    fontFamily: Fonts.uiMedium,
    fontSize: TypeScale.sm,
    color: Colors.foreground,
    flex: 1,
  },
  wonText: {
    color: Colors.positive,
  },
  lostText: {
    color: Colors.negative,
  },
  ptsCell: {
    width: 36,
  },
  ptsText: {
    fontFamily: Fonts.uiBold,
    color: Colors.accent,
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
});
