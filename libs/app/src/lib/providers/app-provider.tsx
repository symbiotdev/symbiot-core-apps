import {
  createContext,
  PropsWithChildren,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { ThemeProvider } from '@symbiot-core-apps/theme';
import {
  AppSettings,
  useAppSettingsOverridesReq,
} from '@symbiot-core-apps/api';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createZustandStorage, useI18n } from '@symbiot-core-apps/shared';
import merge from 'deepmerge';

type AppState = {
  overrides: Partial<AppSettings>;
  setOverrides: (overrides: Partial<AppSettings>) => void;
};

const Context = createContext<AppSettings | undefined>(undefined);
const useAppOverridesState = create<AppState>()(
  persist<AppState>(
    (set) => ({
      overrides: {},
      setOverrides: (overrides) => set({ overrides }),
    }),
    {
      name: 'symbiot-app-settings-overrides',
      storage: createZustandStorage(),
    },
  ),
);

export const AppProvider = ({
  children,
  defaultSettings,
}: PropsWithChildren<{ defaultSettings: AppSettings }>) => {
  const { updateTranslates } = useI18n();
  const { overrides, setOverrides } = useAppOverridesState();
  const { data: remoteOverrides, error: remoteOverridesError } =
    useAppSettingsOverridesReq();

  const loadedRef = useRef(false);

  const appSettings = useMemo(
    () => merge(defaultSettings, overrides),
    [defaultSettings, overrides],
  );

  const loaded = useMemo(
    () =>
      loadedRef.current ||
      !!remoteOverrides ||
      !!remoteOverridesError ||
      !!Object.keys(overrides).length,
    [remoteOverrides, remoteOverridesError, overrides],
  );

  useLayoutEffect(() => {
    if (!remoteOverrides) return;

    setOverrides(remoteOverrides);
    loadedRef.current = true;
  }, [remoteOverrides, setOverrides]);

  useLayoutEffect(() => {
    if (overrides?.language?.translations)
      updateTranslates(overrides.language.translations);
  }, [overrides, updateTranslates]);

  return (
    <Context.Provider value={appSettings}>
      <KeyboardProvider>
        {loaded && (
          <ThemeProvider theme={appSettings.theme}>{children}</ThemeProvider>
        )}
      </KeyboardProvider>
    </Context.Provider>
  );
};

export const useAppSettings = () => useContext(Context) as AppSettings;
