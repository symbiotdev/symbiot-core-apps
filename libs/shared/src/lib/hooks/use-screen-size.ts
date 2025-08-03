import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

export const useScreenSize = () => {
  const { width } = useWindowDimensions();

  return useMemo(
    () => ({
      isSmall: width < 660,
      isBig: width >= 660,
    }),
    [width],
  );
};
