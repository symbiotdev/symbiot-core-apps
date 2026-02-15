import { View, ViewProps } from 'tamagui';
import { StyleSheet, ViewStyle } from 'react-native';
import { Blur } from '../blur/blur';
import { isIos } from '@symbiot-core-apps/shared';

export const NavigationBackground = ({
  blurIntensity,
  blurStyle,
  opacity = 0.8,
  ...props
}: ViewProps & { blurIntensity?: number; blurStyle?: ViewStyle }) => (
  <View
    {...StyleSheet.absoluteFill}
    {...props}
    {...(!isIos && {
      opacity,
      backgroundColor: '$background',
    })}
  >
      <Blur
        style={{
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          ...blurStyle,
        }}
        intensity={blurIntensity}
      />
  </View>
);
