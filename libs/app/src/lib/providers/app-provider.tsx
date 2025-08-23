import { createContext, PropsWithChildren, useContext, useEffect } from 'react';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { I18nProvider } from '@symbiot-core-apps/i18n';
import { ThemeProvider } from '@symbiot-core-apps/theme';
import {
  AppConfig,
  AppConfigIconName,
  AppTranslations,
  useAppConfigQuery,
  useAppTranslationsQuery,
} from '@symbiot-core-apps/api';
import { IconName } from '@symbiot-core-apps/ui';
import { create } from 'zustand/index';
import { persist } from 'zustand/middleware';
import { createZustandStorage } from '@symbiot-core-apps/storage';
import { objectsEqual } from '@symbiot-core-apps/shared';

type AppState = {
  theme?: AppConfig['theme'];
  translations?: AppTranslations['translations'];
  languages?: AppTranslations['languages'];
  icons?: Record<AppConfigIconName, IconName>;
  setTheme: (theme: AppConfig['theme']) => void;
  setTranslations: (translations: AppTranslations) => void;
  setIcons: (icons: Record<AppConfigIconName, IconName>) => void;
};

type AppContext = {
  icons: Record<AppConfigIconName, IconName>;
  theme: AppConfig['theme'];
  languages: AppTranslations['languages'];
};

const Context = createContext<AppContext | undefined>(undefined);
const useAppState = create<AppState>()(
  persist<AppState>(
    (set, get) => ({
      setTheme: (theme) => !objectsEqual(get().theme, theme) && set({ theme }),
      setIcons: (icons) => !objectsEqual(get().icons, icons) && set({ icons }),
      setTranslations: ({ translations, languages }) =>
        !objectsEqual(get().translations, translations) &&
        set({ translations, languages }),
    }),
    {
      name: 'symbiot-app',
      storage: createZustandStorage(),
    },
  ),
);

export const AppProvider = ({ children }: PropsWithChildren) => {
  const { refetch: refetchAppConfig } = useAppConfigQuery();
  const { refetch: refetchTranslates } = useAppTranslationsQuery();
  const {
    icons,
    theme,
    languages,
    translations,
    setIcons,
    setTheme,
    setTranslations,
  } = useAppState();

  // fixme add catch screen

  useEffect(() => {
    refetchAppConfig().then(({ data }) => {
      if (data) {
        setIcons(data.icons as Record<AppConfigIconName, IconName>);
        setTheme(data.theme);
      }
    });

    refetchTranslates().then(({ data }) => {
      if (data) {
        setTranslations(data);
      }
    });
  }, [
    refetchAppConfig,
    refetchTranslates,
    setIcons,
    setTheme,
    setTranslations,
  ]);

  return (
    !!icons &&
    !!theme &&
    !!languages &&
    !!translations && (
      <Context.Provider value={{ icons, theme, languages }}>
        <KeyboardProvider>
          <I18nProvider translations={translations}>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
          </I18nProvider>
        </KeyboardProvider>
      </Context.Provider>
    )
  );
};

export const useApp = () => useContext(Context) as AppContext;
