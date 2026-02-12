import {
  createZustandStorage,
  isTablet,
  isWeb,
  useScreenSize,
} from '@symbiot-core-apps/shared';
import { useMemo } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type DrawerState = {
  compressed: boolean;
  toggleCompressed: () => void;
};

export const useDrawerState = create<DrawerState>()(
  persist<DrawerState>(
    (set, get) => ({
      compressed: true,
      toggleCompressed: () => set({ compressed: !get().compressed }),
    }),
    {
      name: 'symbiot-drawer',
      storage: createZustandStorage(),
    },
  ),
);

export const useDrawer = () => {
  const { media } = useScreenSize();

  return useMemo(
    () => ({
      permanent: ['xxs', 'xs', 'sm', 'md'].includes(media),
      visible: isTablet || isWeb,
    }),
    [media],
  );
};
