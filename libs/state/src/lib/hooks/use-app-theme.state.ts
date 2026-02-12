import {
  createZustandStorage,
  isWeb,
  SystemScheme,
  useSystemScheme,
} from '@symbiot-core-apps/shared';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useCallback, useMemo } from 'react';
import { Appearance } from 'react-native';

type AppSchemeState = {
  scheme?: SystemScheme;
  setScheme: (scheme: SystemScheme) => void;
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

export const useScheme = () => {
  const systemScheme = useSystemScheme();
  const {
    scheme: appScheme,
    setScheme: setAppScheme,
    removeScheme: removeAppScheme,
  } = useAppSchemeState();

  const scheme = useMemo(
    () => appScheme || systemScheme,
    [appScheme, systemScheme],
  );

  const setScheme = useCallback(
    (scheme: SystemScheme | undefined) => {
      if (isWeb) {
        if (scheme) {
          setAppScheme(scheme);
        } else {
          removeAppScheme();
        }
      } else {
        Appearance.setColorScheme(scheme);
      }
    },
    [removeAppScheme, setAppScheme],
  );

  return {
    scheme,
    setScheme,
  };
};
