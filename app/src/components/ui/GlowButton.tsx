import React from 'react';
import { StyleSheet, Text, ViewStyle } from 'react-native';
import { Colors } from '../../constants/colors';
import { Fonts, TypeScale } from '../../constants/typography';
import { Spacing, Radius } from '../../constants/layout';
import { PressableScale } from './PressableScale';

interface GlowButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  icon?: React.ReactNode;
}

export function GlowButton({ label, onPress, disabled, style, icon }: GlowButtonProps) {
  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled}
      haptic
      style={[styles.button, disabled && styles.disabled, style]}
    >
      {icon}
      <Text style={styles.label}>{label}</Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[2],
    backgroundColor: Colors.accent,
    borderRadius: Radius.md,
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[5],
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 0,
  },
  disabled: {
    opacity: 0.4,
    shadowOpacity: 0,
  },
  label: {
    fontFamily: Fonts.uiBold,
    fontSize: TypeScale.base,
    color: Colors.onAccent,
    letterSpacing: 0.3,
  },
});
