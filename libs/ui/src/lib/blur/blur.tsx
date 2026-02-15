import { memo, PropsWithChildren } from 'react';
import { BlurView as ExpoBlurView } from 'expo-blur';
import { ViewStyle } from 'react-native';
import { useAppScheme } from '@symbiot-core-apps/state';

export const Blur = memo(
  ({
    children,
    style,
    intensity = 40,
  }: PropsWithChildren<{ style?: ViewStyle; intensity?: number }>) => {
    const { scheme } = useAppScheme();

    return (
      <ExpoBlurView
        intensity={intensity}
        tint={scheme}
        style={style}
        children={children}
      />
    );
  },
);
