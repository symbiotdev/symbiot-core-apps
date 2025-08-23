import {
  createContext,
  PropsWithChildren,
  useContext,
  useLayoutEffect,
} from 'react';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { I18nProvider } from '@symbiot-core-apps/i18n';
import { ThemeProvider } from '@symbiot-core-apps/theme';
import { AppConfig, AppConfigIconName, useAppConfigQuery } from '@symbiot-core-apps/api';
import { IconName } from '@symbiot-core-apps/ui';
import { create } from 'zustand/index';
import { persist } from 'zustand/middleware';
import { createZustandStorage } from '@symbiot-core-apps/storage';
import { objectsEqual } from '@symbiot-core-apps/shared';

type AppState = {
  icons?: Record<AppConfigIconName, IconName>;
  theme?: AppConfig['theme'];
  setIcons: (icons: Record<AppConfigIconName, IconName>) => void;
  setTheme: (theme: AppConfig['theme']) => void;
};

type AppContext = {
  icons: Record<AppConfigIconName, IconName>;
  theme: AppConfig['theme'];
};

const Context = createContext<AppContext | undefined>(undefined);
const useAppState = create<AppState>()(
  persist<AppState>(
    (set, get) => ({
      setIcons: (icons) => !objectsEqual(get().icons, icons) && set({ icons }),
      setTheme: (theme) => !objectsEqual(get().theme, theme) && set({ theme }),
    }),
    {
      name: 'symbiot-app',
      storage: createZustandStorage(),
    },
  ),
);

export const AppProvider = ({ children }: PropsWithChildren) => {
  const { icons, setIcons, theme, setTheme } = useAppState();
  const { data: appConfig } = useAppConfigQuery();

  useLayoutEffect(() => {
    if (appConfig) {
      setIcons(appConfig.icons as Record<AppConfigIconName, IconName>);
      setTheme(appConfig.theme);
    }
  }, [appConfig, setIcons, setTheme]);

  return (
    !!icons &&
    !!theme && (
      <Context.Provider value={{ icons, theme }}>
        <KeyboardProvider>
          <I18nProvider>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
          </I18nProvider>
        </KeyboardProvider>
      </Context.Provider>
    )
  );
};

export const useApp = () => useContext(Context) as AppContext;
