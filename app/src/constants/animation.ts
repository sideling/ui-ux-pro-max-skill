import { Easing } from 'react-native-reanimated';

export const Easing_ = {
  // Expo out — smooth deceleration for entering elements
  out: Easing.bezier(0.16, 1, 0.3, 1),
  // Ease in — for exiting elements
  in: Easing.bezier(0.4, 0, 1, 1),
  // Standard — general transitions
  standard: Easing.bezier(0.4, 0, 0.2, 1),
} as const;

export const Duration = {
  fast: 150,
  normal: 250,
  slow: 350,
  enter: 300,
  exit: 200,   // exit slightly faster than enter
} as const;

export const Spring = {
  // Snappy — button press, like tap
  snappy: { damping: 20, stiffness: 300 },
  // Bouncy — modal entrance, card expand
  bouncy: { damping: 20, stiffness: 90 },
  // Smooth — tab transitions
  smooth: { damping: 30, stiffness: 120 },
} as const;
