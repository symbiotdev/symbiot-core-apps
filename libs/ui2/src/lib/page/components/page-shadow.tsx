import { memo, useMemo } from 'react';
import { useAppScheme } from '@symbiot-core-apps/state';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, useWindowDimensions, ViewStyle } from 'react-native';
import { isIos, isWeb } from '@symbiot-core-apps/shared';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

const SHADOW_HEIGHT = 25;
const ABSOLUTE_FILL: ViewStyle = {
  ...StyleSheet.absoluteFill,
  pointerEvents: 'none',
};

export const PageShadow = isWeb
  ? () => null
  : memo(() => {
      const { scheme } = useAppScheme();
      const { top, bottom } = useSafeAreaInsets();
      const { width, height } = useWindowDimensions();

      const color = useMemo(
        () => (scheme === 'light' ? '#FFFFFF' : '#000000'),
        [scheme],
      );

      const { topId, bottomId } = useMemo(
        () => ({
          topId: `topShadow-${Math.random().toString(36)}`,
          bottomId: `topShadow-${Math.random().toString(36)}`,
        }),
        [],
      );

      return (
        <Svg width={width} height={height} style={ABSOLUTE_FILL}>
          <Defs>
            <LinearGradient id={topId} x1={0} y1={0} x2={0} y2={1}>
              <Stop stopColor={color} offset={0.2} stopOpacity={1} />
              <Stop stopColor={color} offset={1} stopOpacity={0} />
            </LinearGradient>

            <LinearGradient id={bottomId} x1={0} y1={1} x2={0} y2={0}>
              <Stop stopColor={color} offset={0} stopOpacity={1} />
              <Stop stopColor={color} offset={1} stopOpacity={0} />
            </LinearGradient>
          </Defs>

          {/* Top shadow */}
          <Rect
            x={0}
            y={0}
            width={width}
            height={top + SHADOW_HEIGHT}
            fill={`url(#${topId})`}
          />

          {/* Bottom shadow */}
          {isIos && (
            <Rect
              x={0}
              y={height - bottom - SHADOW_HEIGHT}
              width={width}
              height={bottom + SHADOW_HEIGHT}
              fill={`url(#${bottomId})`}
            />
          )}
        </Svg>
      );
    });
