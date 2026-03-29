import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/typography';

// Generate a consistent color from the avatar seed
function seedToColor(seed: string): string {
  const colors = [
    '#F97316', '#EF4444', '#8B5CF6', '#3B82F6',
    '#10B981', '#EC4899', '#F59E0B', '#06B6D4',
  ];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

interface AvatarProps {
  seed: string;
  username: string | null;
  size?: number;
}

export function Avatar({ seed, username, size = 32 }: AvatarProps) {
  const bg = seedToColor(seed || username || 'anon');
  const initials = username
    ? username.slice(0, 2).toUpperCase()
    : '?';
  const fontSize = Math.floor(size * 0.38);

  return (
    <View
      style={[
        styles.container,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: bg },
      ]}
    >
      <Text style={[styles.text, { fontSize }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: Fonts.uiBold,
    color: '#fff',
    lineHeight: undefined,
  },
});
