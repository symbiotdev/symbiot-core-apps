import { useScreenSize } from '@symbiot-core-apps/shared';
import { useMemo } from 'react';
import { DrawerNavigationOptions } from '@react-navigation/drawer';
import { Platform } from 'react-native';
import { create } from 'zustand/index';
import { persist } from 'zustand/middleware';
import { createZustandStorage } from '@symbiot-core-apps/storage';

type DrawerState = {
  compressed: boolean;
  resizing: boolean;
  toggleCompressed: () => void;
};

export const drawerAnimationDuration = 250;

export const useDrawerState = create<DrawerState>()(
  persist<DrawerState>(
    (set, get) => ({
      compressed: false,
      resizing: false,
      toggleCompressed: () => {
        set({ compressed: !get().compressed, resizing: true });

        setTimeout(() => set({ resizing: false }), drawerAnimationDuration + 1);
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
    const visible = Platform.OS === 'web' || permanent;

    return {
      visible,
      permanent,
      headerShown: visible && !permanent,
      type: (permanent
        ? 'permanent'
        : 'front') as DrawerNavigationOptions['drawerType'],
    };
  }, [media]);
};
