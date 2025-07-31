import { memo } from 'react';
import { BlurView as ExpoBlurView } from 'expo-blur';
import { ViewStyle } from 'react-native';
import { useScheme } from '@symbiot-core-apps/state';

export const Blur = memo(({ style }: { style?: ViewStyle }) => {
  const { scheme } = useScheme();

  return (
    <ExpoBlurView
      intensity={30}
      experimentalBlurMethod="dimezisBlurView"
      tint={scheme}
      style={style}
    />
  );
});
