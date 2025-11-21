import { View, ViewProps } from 'tamagui';
import { Platform, StyleSheet } from 'react-native';
import { Blur } from '../blur/blur';

export const NavigationBackground = ({
  blurIntensity,
  ...props
}: ViewProps & { blurIntensity?: number }) => (
  <View style={StyleSheet.absoluteFillObject}>
    <View
      position="absolute"
      width="100%"
      height="100%"
      opacity={Platform.OS !== 'android' ? 0.4 : 1}
      backgroundColor="$background"
      {...props}
    />
    {Platform.OS !== 'android' && (
      <Blur style={{ flex: 1 }} intensity={blurIntensity} />
    )}
  </View>
);
