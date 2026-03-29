import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Colors } from '../../constants/colors';
import { Fonts, TypeScale } from '../../constants/typography';
import { Spacing, Radius } from '../../constants/layout';

export function LiveBadge() {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.3, { duration: 600 }),
        withTiming(1, { duration: 600 })
      ),
      -1
    );
  }, [opacity]);

  const dotStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.dot, dotStyle]} />
      <Text style={styles.text}>LIVE</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.liveDim,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.live,
    paddingHorizontal: Spacing[2],
    paddingVertical: 3,
    gap: Spacing[1],
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.live,
  },
  text: {
    fontFamily: Fonts.uiBold,
    fontSize: TypeScale.xs,
    color: Colors.live,
    letterSpacing: 0.8,
  },
});
