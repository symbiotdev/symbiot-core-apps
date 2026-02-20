import { memo } from 'react';
import { useAppScheme } from '@symbiot-core-apps/state';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { isWeb } from '@symbiot-core-apps/shared';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

export const PageShadow = memo(() => {
  const { scheme } = useAppScheme();
  const { top, bottom } = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  if (isWeb) return null;

  const color = scheme === 'light' ? '#FFFFFF' : '#000000';

  return (
    <Svg
      width={width}
      height={height}
      style={{ ...StyleSheet.absoluteFill, pointerEvents: 'none' }}
    >
      <Defs>
        <LinearGradient id="topShadow" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0.2" stopColor={color} stopOpacity="1" />
          <Stop offset="1" stopColor={color} stopOpacity="0" />
        </LinearGradient>

        <LinearGradient id="bottomShadow" x1="0" y1="1" x2="0" y2="0">
          <Stop offset="0" stopColor={color} stopOpacity="1" />
          <Stop offset="1" stopColor={color} stopOpacity="0" />
        </LinearGradient>
      </Defs>

      {/* Top shadow */}
      <Rect
        x={0}
        y={0}
        width={width}
        height={top + 25}
        fill="url(#topShadow)"
      />

      {/* Bottom shadow */}
      <Rect
        x={0}
        y={height - bottom - 25}
        width={width}
        height={bottom + 25}
        fill="url(#bottomShadow)"
      />
    </Svg>
  );
});
