import { memo } from 'react';
import { BlurView as ExpoBlurView } from 'expo-blur';
import { ViewStyle } from 'react-native';
import { useScheme } from '@symbiot-core-apps/state';

export const Blur = memo(
  ({ style, intensity = 30 }: { style?: ViewStyle; intensity?: number }) => {
    const { scheme } = useScheme();

    return (
      <ExpoBlurView
        intensity={intensity}
        experimentalBlurMethod="dimezisBlurView"
        tint={scheme}
        style={style}
      />
    );
  },
);
