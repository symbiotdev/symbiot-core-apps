import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

export const useScreenSize = () => {
  const { width } = useWindowDimensions();

  return useMemo(
    () => ({
      isSmall: width < 768,
      isBig: width >= 768,
    }),
    [width],
  );
};
