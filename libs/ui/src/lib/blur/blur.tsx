import { memo } from 'react';
import { BlurView as ExpoBlurView } from 'expo-blur';
import { useSystemScheme } from '@symbiot-core-apps/shared';
import { ViewStyle } from 'react-native';

export const Blur = memo(({ style }: { style?: ViewStyle }) => {
  const scheme = useSystemScheme();

  return (
    <ExpoBlurView
      intensity={30}
      experimentalBlurMethod="dimezisBlurView"
      tint={scheme}
      style={style}
    />
  );
});
