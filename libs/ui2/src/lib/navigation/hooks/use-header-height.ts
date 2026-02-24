import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMemo } from 'react';
import { HEADER_HEIGHT } from '../consts/dimensions';

export const useHeaderHeight = () => {
  const { top } = useSafeAreaInsets();

  return useMemo(() => top + HEADER_HEIGHT, [top]);
};
