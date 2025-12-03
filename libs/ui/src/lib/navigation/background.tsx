import { View, ViewProps } from 'tamagui';
import { Platform, StyleSheet, ViewStyle } from 'react-native';
import { Blur } from '../blur/blur';

export const NavigationBackground = ({
  blurIntensity,
  blurStyle,
  opacity = 0.8,
  ...props
}: ViewProps & { blurIntensity?: number; blurStyle?: ViewStyle }) => (
  <View style={StyleSheet.absoluteFillObject}>
    {Platform.OS !== 'android' && (
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

    <View
      position="absolute"
      width="100%"
      height="100%"
      opacity={Platform.OS !== 'android' ? opacity : 0.8}
      backgroundColor="$background"
      {...props}
    />
  </View>
);
