import { useScreenSize } from '@symbiot-core-apps/shared';
import { useMemo } from 'react';
import { DrawerNavigationOptions } from '@react-navigation/drawer';
import { Platform } from 'react-native';
import { create } from 'zustand/index';
import { persist } from 'zustand/middleware';
import { createZustandStorage } from '@symbiot-core-apps/storage';

type DrawerState = {
  compressed: boolean;
  toggleCompressed: () => void;
};

export const useDrawerState = create<DrawerState>()(
  persist<DrawerState>(
    (set, get) => ({
      compressed: false,
      toggleCompressed: () => {
        set({ compressed: !get().compressed });
      },
    }),
    {
      name: 'symbiot-drawer',
      storage: createZustandStorage(),
    },
  ),
);

export const useDrawer = () => {
  const { media } = useScreenSize();

  return useMemo(() => {
    const permanent = ['lg', 'xl'].includes(media);
    const available = Platform.OS === 'web' || permanent;

    return {
      available,
      permanent,
      headerShown: available && !permanent,
      type: (permanent
        ? 'permanent'
        : 'front') as DrawerNavigationOptions['drawerType'],
    };
  }, [media]);
};
