import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createZustandStorage } from '@symbiot-core-apps/shared';
import { AppSettings, PlatformVersionDetails } from '@symbiot-core-apps/api';

type AppState = {
  versionDetails?: PlatformVersionDetails;
  overriddenSettings: Partial<AppSettings>;
  setOverriddenSettings: (overriddenSettings: Partial<AppSettings>) => void;
  setVersionDetails: (versionDetails: PlatformVersionDetails) => void;
};

export const useAppState = create<AppState>()(
  persist<AppState>(
    (set) => ({
      overriddenSettings: {},
      setVersionDetails: (versionDetails) => set({ versionDetails }),
      setOverriddenSettings: (overriddenSettings) =>
        set({ overriddenSettings }),
    }),
    {
      name: 'symbiot::app-state',
      storage: createZustandStorage(),
    },
  ),
);
