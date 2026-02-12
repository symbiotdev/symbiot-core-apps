import { View, ViewProps } from 'tamagui';
import { Platform, StyleSheet, ViewStyle } from 'react-native';
import { Blur } from '../blur/blur';

export const NavigationBackground = ({
  blurIntensity,
  blurStyle,
  opacity = 0.8,
  ...props
}: ViewProps & { blurIntensity?: number; blurStyle?: ViewStyle }) => (
  <View
    {...StyleSheet.absoluteFillObject}
    {...props}
    {...(Platform.OS !== 'ios' && {
      opacity,
      backgroundColor: '$background',
    })}
  >
    {Platform.OS === 'ios' && (
      <Blur
        style={{
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          ...blurStyle,
        }}
        intensity={blurIntensity}
      />
    )}
  </View>
);
