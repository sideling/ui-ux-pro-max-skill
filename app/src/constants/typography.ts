import { StyleSheet } from 'react-native';
import { Colors } from './colors';

// Font families
export const Fonts = {
  // Russo One — scores, team names, display headings
  display: 'RussoOne_400Regular',
  // Chakra Petch — UI labels, tabs, badges, metadata
  ui: 'ChakraPetch_400Regular',
  uiMedium: 'ChakraPetch_500Medium',
  uiSemiBold: 'ChakraPetch_600SemiBold',
  uiBold: 'ChakraPetch_700Bold',
} as const;

// Type scale
export const TypeScale = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  '2xl': 30,
  '3xl': 38,
  '4xl': 48,
} as const;

export const TextStyles = StyleSheet.create({
  // Display — scores, big numbers
  scoreXL: {
    fontFamily: Fonts.display,
    fontSize: TypeScale['3xl'],
    color: Colors.foreground,
    lineHeight: TypeScale['3xl'] * 1.1,
  },
  scoreLG: {
    fontFamily: Fonts.display,
    fontSize: TypeScale['2xl'],
    color: Colors.foreground,
    lineHeight: TypeScale['2xl'] * 1.1,
  },
  heading: {
    fontFamily: Fonts.display,
    fontSize: TypeScale.xl,
    color: Colors.foreground,
    lineHeight: TypeScale.xl * 1.2,
  },
  // UI Labels
  labelLG: {
    fontFamily: Fonts.uiSemiBold,
    fontSize: TypeScale.md,
    color: Colors.foreground,
    lineHeight: TypeScale.md * 1.4,
  },
  labelMD: {
    fontFamily: Fonts.uiMedium,
    fontSize: TypeScale.base,
    color: Colors.foreground,
    lineHeight: TypeScale.base * 1.4,
  },
  labelSM: {
    fontFamily: Fonts.ui,
    fontSize: TypeScale.sm,
    color: Colors.foregroundMuted,
    lineHeight: TypeScale.sm * 1.4,
  },
  labelXS: {
    fontFamily: Fonts.uiBold,
    fontSize: TypeScale.xs,
    color: Colors.foregroundMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    lineHeight: TypeScale.xs * 1.4,
  },
  // Body — chat messages
  body: {
    fontFamily: Fonts.ui,
    fontSize: TypeScale.base,
    color: Colors.foreground,
    lineHeight: TypeScale.base * 1.5,
  },
  bodyMuted: {
    fontFamily: Fonts.ui,
    fontSize: TypeScale.base,
    color: Colors.foregroundMuted,
    lineHeight: TypeScale.base * 1.5,
  },
  bodySM: {
    fontFamily: Fonts.ui,
    fontSize: TypeScale.sm,
    color: Colors.foregroundMuted,
    lineHeight: TypeScale.sm * 1.5,
  },
});
