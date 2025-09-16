import { memo, PropsWithChildren } from 'react';
import { BlurView as ExpoBlurView } from 'expo-blur';
import { ViewStyle } from 'react-native';
import { useScheme } from '@symbiot-core-apps/state';

export const Blur = memo(
  ({
    children,
    style,
    intensity = 50,
  }: PropsWithChildren<{ style?: ViewStyle; intensity?: number }>) => {
    const { scheme } = useScheme();

    return (
      <ExpoBlurView
        intensity={intensity}
        experimentalBlurMethod="dimezisBlurView"
        tint={scheme}
        style={style}
        children={children}
      />
    );
  },
);
