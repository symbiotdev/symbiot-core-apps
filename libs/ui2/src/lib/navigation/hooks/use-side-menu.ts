import {
  createZustandStorage,
  isTablet,
  isWeb,
  useScreenSize,
} from '@symbiot-core-apps/shared';
import { useMemo } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type State = {
  compressed: boolean;
  toggleCompressed: () => void;
};

export const useSideMenuState = create<State>()(
  persist<State>(
    (set, get) => ({
      compressed: true,
      toggleCompressed: () => set({ compressed: !get().compressed }),
    }),
    {
      name: 'symbiot::side-menu',
      storage: createZustandStorage(),
    },
  ),
);

export const useSideMenu = () => {
  const { media } = useScreenSize();

  return useMemo(
    () => ({
      permanent: ['xxs', 'xs', 'sm', 'md'].includes(media),
      visible: isTablet || isWeb,
    }),
    [media],
  );
};
