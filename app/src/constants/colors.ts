export const Colors = {
  // Backgrounds
  bgDeep: '#020203',
  bgBase: '#050506',
  bgElevated: '#0a0a0c',
  bgCard: '#0e0e11',

  // Surfaces
  surface: 'rgba(255,255,255,0.05)',
  surfaceHover: 'rgba(255,255,255,0.08)',
  surfaceActive: 'rgba(255,255,255,0.12)',

  // Foregrounds
  foreground: '#EDEDEF',
  foregroundMuted: '#8A8F98',
  foregroundSubtle: '#4A4F5C',

  // Borders
  border: 'rgba(255,255,255,0.08)',
  borderStrong: 'rgba(255,255,255,0.16)',

  // Accent — orange (energy, CTAs)
  accent: '#F97316',
  accentDim: 'rgba(249,115,22,0.15)',
  accentGlow: 'rgba(249,115,22,0.25)',
  onAccent: '#ffffff',

  // Live — red
  live: '#EF4444',
  liveDim: 'rgba(239,68,68,0.15)',
  onLive: '#ffffff',

  // Positive — green (likes)
  positive: '#22C55E',
  positiveDim: 'rgba(34,197,94,0.15)',

  // Negative — red-ish (dislikes)
  negative: '#F43F5E',
  negativeDim: 'rgba(244,63,94,0.15)',

  // Transparent
  transparent: 'transparent',
} as const;

export type ColorKey = keyof typeof Colors;
