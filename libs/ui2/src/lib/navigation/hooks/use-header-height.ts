import { useMemo } from 'react';
import { HEADER_HEIGHT } from '../consts/dimensions';
import { useInsets } from '@symbiot-core-apps/shared';

export const useHeaderHeight = () => {
  const { top } = useInsets();

  return useMemo(() => top + HEADER_HEIGHT, [top]);
};
