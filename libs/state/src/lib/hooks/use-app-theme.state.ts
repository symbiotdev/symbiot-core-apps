import { Scheme } from '@symbiot-core-apps/shared';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createZustandStorage } from '@symbiot-core-apps/storage';

type AppSchemeState = {
  scheme?: Scheme;
  setScheme: (scheme: Scheme) => void;
  removeScheme: () => void;
};

export const useAppSchemeState = create<AppSchemeState>()(
  persist<AppSchemeState>(
    (set) => ({
      setScheme: (scheme) => set({ scheme }),
      removeScheme: () => set({ scheme: undefined }),
    }),
    {
      name: 'symbiot-app-scheme',
      storage: createZustandStorage(),
    },
  ),
);
