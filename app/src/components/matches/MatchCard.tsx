import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Fonts, TypeScale } from '../../constants/typography';
import { Spacing, Radius } from '../../constants/layout';
import { PressableScale } from '../ui/PressableScale';
import { LiveBadge } from '../ui/LiveBadge';
import type { Match } from '../../types/models';

interface MatchCardProps {
  match: Match;
}

function formatKickoff(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', hour12: true });
}

export const MatchCard = memo(function MatchCard({ match }: MatchCardProps) {
  const isLive = match.status === 'live';
  const isFulltime = match.status === 'fulltime';

  return (
    <PressableScale
      onPress={() => router.push(`/match/${match.id}`)}
      style={styles.card}
      haptic
    >
      {/* Status row */}
      <View style={styles.statusRow}>
        {isLive ? (
          <LiveBadge />
        ) : (
          <Text style={styles.statusText}>
            {isFulltime ? 'FULL TIME' : formatKickoff(match.kickoff_at)}
          </Text>
        )}
        <View style={styles.activeUsers}>
          <Ionicons name="people" size={12} color={Colors.foregroundMuted} />
          <Text style={styles.activeUsersText}>{match.active_users.toLocaleString()}</Text>
        </View>
      </View>

      {/* Score row */}
      <View style={styles.scoreRow}>
        {/* Home */}
        <View style={styles.teamBlock}>
          <View style={[styles.teamDot, { backgroundColor: match.home_team.primary_color }]} />
          <Text style={styles.teamName} numberOfLines={1}>{match.home_team.short_name}</Text>
        </View>

        {/* Score */}
        <View style={styles.scoreBlock}>
          {isLive || isFulltime ? (
            <Text style={styles.score}>
              {match.home_score}
              <Text style={styles.scoreDivider}> – </Text>
              {match.away_score}
            </Text>
          ) : (
            <Text style={styles.vs}>VS</Text>
          )}
          {isLive && match.match_minute != null && (
            <Text style={styles.minute}>{match.match_minute}'</Text>
          )}
        </View>

        {/* Away */}
        <View style={[styles.teamBlock, styles.teamBlockRight]}>
          <Text style={styles.teamName} numberOfLines={1}>{match.away_team.short_name}</Text>
          <View style={[styles.teamDot, { backgroundColor: match.away_team.primary_color }]} />
        </View>
      </View>

      {/* Full team names */}
      <View style={styles.fullNamesRow}>
        <Text style={styles.fullName} numberOfLines={1}>{match.home_team.name}</Text>
        <Text style={[styles.fullName, styles.fullNameRight]} numberOfLines={1}>
          {match.away_team.name}
        </Text>
      </View>

      {/* Venue */}
      {match.venue && (
        <View style={styles.venueRow}>
          <Ionicons name="location-outline" size={11} color={Colors.foregroundSubtle} />
          <Text style={styles.venue}>{match.venue}</Text>
        </View>
      )}

      {/* Chat CTA */}
      <View style={styles.cta}>
        <Ionicons name="chatbubble-ellipses-outline" size={13} color={Colors.accent} />
        <Text style={styles.ctaText}>
          {isLive ? 'Join live chat' : isFulltime ? 'Match chat' : 'Pre-match chat'}
        </Text>
        <Ionicons name="chevron-forward" size={13} color={Colors.accent} />
      </View>
    </PressableScale>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    padding: Spacing[4],
    gap: Spacing[3],
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusText: {
    fontFamily: Fonts.uiBold,
    fontSize: TypeScale.xs,
    color: Colors.foregroundMuted,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  activeUsers: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  activeUsersText: {
    fontFamily: Fonts.ui,
    fontSize: TypeScale.xs,
    color: Colors.foregroundMuted,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  teamBlock: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
  teamBlockRight: {
    justifyContent: 'flex-end',
  },
  teamDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  teamName: {
    fontFamily: Fonts.display,
    fontSize: TypeScale.lg,
    color: Colors.foreground,
  },
  scoreBlock: {
    alignItems: 'center',
    minWidth: 80,
  },
  score: {
    fontFamily: Fonts.display,
    fontSize: TypeScale['2xl'],
    color: Colors.foreground,
  },
  scoreDivider: {
    color: Colors.foregroundMuted,
  },
  vs: {
    fontFamily: Fonts.uiBold,
    fontSize: TypeScale.sm,
    color: Colors.foregroundMuted,
    letterSpacing: 1,
  },
  minute: {
    fontFamily: Fonts.ui,
    fontSize: TypeScale.xs,
    color: Colors.live,
    marginTop: 2,
  },
  fullNamesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fullName: {
    fontFamily: Fonts.ui,
    fontSize: TypeScale.xs,
    color: Colors.foregroundMuted,
    flex: 1,
  },
  fullNameRight: {
    textAlign: 'right',
  },
  venueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  venue: {
    fontFamily: Fonts.ui,
    fontSize: TypeScale.xs,
    color: Colors.foregroundSubtle,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
    paddingTop: Spacing[3],
  },
  ctaText: {
    flex: 1,
    fontFamily: Fonts.uiMedium,
    fontSize: TypeScale.sm,
    color: Colors.accent,
  },
});
