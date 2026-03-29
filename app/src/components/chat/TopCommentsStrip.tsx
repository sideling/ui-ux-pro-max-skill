import React, { memo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Fonts, TypeScale } from '../../constants/typography';
import { Spacing, Radius } from '../../constants/layout';
import { useTopComments } from '../../hooks/useMatchChat';
import type { Message } from '../../types/models';

interface TopCommentsStripProps {
  matchId: string;
}

const TopChip = memo(function TopChip({ message }: { message: Message }) {
  return (
    <View style={styles.chip}>
      <View style={styles.chipHeader}>
        <Ionicons name="thumbs-up" size={10} color={Colors.positive} />
        <Text style={styles.chipLikes}>{message.likes}</Text>
        <Text style={styles.chipUser} numberOfLines={1}>
          {message.profile?.username ?? 'Fan'}
        </Text>
      </View>
      <Text style={styles.chipBody} numberOfLines={2}>{message.body}</Text>
    </View>
  );
});

export function TopCommentsStrip({ matchId }: TopCommentsStripProps) {
  const { data: tops } = useTopComments(matchId);

  if (!tops || tops.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Ionicons name="trophy" size={12} color={Colors.accent} />
        <Text style={styles.label}>TOP COMMENTS</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {tops.map((msg) => (
          <TopChip key={msg.id} message={msg} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
    paddingBottom: Spacing[3],
    gap: Spacing[2],
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[3],
  },
  label: {
    fontFamily: Fonts.uiBold,
    fontSize: TypeScale.xs,
    color: Colors.accent,
    letterSpacing: 0.6,
  },
  scroll: {
    paddingHorizontal: Spacing[4],
    gap: Spacing[2],
  },
  chip: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.accentDim,
    padding: Spacing[3],
    width: 180,
    gap: Spacing[1],
  },
  chipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  chipLikes: {
    fontFamily: Fonts.uiBold,
    fontSize: TypeScale.xs,
    color: Colors.positive,
  },
  chipUser: {
    fontFamily: Fonts.ui,
    fontSize: TypeScale.xs,
    color: Colors.foregroundMuted,
    flex: 1,
  },
  chipBody: {
    fontFamily: Fonts.ui,
    fontSize: TypeScale.xs,
    color: Colors.foreground,
    lineHeight: TypeScale.xs * 1.5,
  },
});
