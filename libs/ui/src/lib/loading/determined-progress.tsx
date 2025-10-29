import React, { memo, useEffect } from 'react';
import Animated, {
  FadeIn,
  FadeOut,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { StyleSheet } from 'react-native';

export const DeterminedProgressBar = memo(
  ({
    reversed,
    type,
    rtl,
    color,
  }: {
    type?: 'determinate' | 'indeterminate';
    reversed?: boolean;
    rtl?: boolean;
    color: [string, string, string, string, string];
  }) => {
    const width$ = useSharedValue(0);
    const opposite = (rtl && !reversed) || (!rtl && reversed);

    const animatedStyle = useAnimatedStyle(
      () => ({
        alignSelf: opposite ? 'flex-end' : 'flex-start',
        backgroundColor: interpolateColor(
          width$.value,
          [0, 25, 50, 75, 100],
          color,
        ),
        width: `${
          type === 'determinate'
            ? width$.value
            : interpolate(width$.value, [0, 100], [20, 100])
        }%`,
        [!opposite ? 'right' : 'left']: undefined,
        [opposite ? 'right' : 'left']: `${
          type === 'determinate'
            ? 0
            : interpolate(width$.value, [0, 100], [-20, 100])
        }%`,
      }),
      [type],
    );

    useEffect(() => {
      width$.value = withRepeat(withTiming(100, { duration: 1500 }), -1);
    }, []);

    return (
      <Animated.View
        style={styles.container}
        entering={FadeIn}
        exiting={FadeOut}
      >
        <Animated.View style={[styles.progress, animatedStyle]} />
      </Animated.View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    zIndex: 1,
    height: 2,
    width: '100%',
    pointerEvents: 'none',
  },
  progress: {
    position: 'absolute',
    height: 2,
  },
});
