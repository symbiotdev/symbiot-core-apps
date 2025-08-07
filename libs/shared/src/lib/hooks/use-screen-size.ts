import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

export const SCREEN_MEDIA_SIZE = {
  xxs: 390,
  xs: 660,
  sm: 800,
  md: 1020,
  lg: 1280,
  xl: 1680,
};

export type ScreenMediaSize = keyof typeof SCREEN_MEDIA_SIZE;

export const useScreenSize = () => {
  const { width } = useWindowDimensions();

  const media = useMemo(
    () =>
      (Object.keys(SCREEN_MEDIA_SIZE) as ScreenMediaSize[])
        .sort((key1, key2) => SCREEN_MEDIA_SIZE[key2] - SCREEN_MEDIA_SIZE[key1])
        .find((key) => SCREEN_MEDIA_SIZE[key] <= width) as ScreenMediaSize,
    [width],
  );

  return { media };
};
