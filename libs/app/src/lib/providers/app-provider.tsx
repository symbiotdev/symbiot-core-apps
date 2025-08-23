import {
  createContext,
  PropsWithChildren,
  useContext,
  useLayoutEffect,
  useState,
} from 'react';
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
import { LoadAssetsFailed } from '../components/load-assets-failed';
import { AssetsLoading } from '../components/assets-loading';

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
  const {
    icons,
    theme,
    languages,
    translations,
    setIcons,
    setTheme,
    setTranslations,
  } = useAppState();
  const { data: appConfig, error: appConfigError } = useAppConfigQuery({
    refetch: !icons,
  });
  const { data: appTranslations, error: appTranslationError } =
    useAppTranslationsQuery({
      refetch: !translations,
    });

  const [loadConfigFailed, setLoadConfigFailed] = useState(false);
  const [loadTranslationsFailed, setLoadTranslationsFailed] = useState(false);

  useLayoutEffect(() => {
    if (appConfig) {
      if (
        !appConfig.icons ||
        !appConfig.theme ||
        !Object.keys(appConfig.theme).length
      ) {
        setLoadConfigFailed(true);
      } else {
        setIcons(appConfig.icons as Record<AppConfigIconName, IconName>);
        setTheme(appConfig.theme);
      }
    }

    if (appConfigError) {
      setLoadConfigFailed(true);
    }
  }, [appConfig, appConfigError, setIcons, setTheme]);

  useLayoutEffect(() => {
    if (appTranslations) {
      if (
        !appTranslations.languages?.length ||
        !appTranslations.translations ||
        Object.keys(appTranslations.translations).length !==
          appTranslations.languages.length
      ) {
        setLoadTranslationsFailed(true);
      } else {
        setTranslations(appTranslations);
        setLoadTranslationsFailed(false);
      }
    }

    if (appTranslationError) {
      setLoadTranslationsFailed(true);
    }
  }, [appTranslationError, appTranslations, setTranslations]);

  const hasAssets = !!icons && !!theme && !!languages && !!translations;

  if (!hasAssets) {
    if (loadConfigFailed || loadTranslationsFailed) {
      return <LoadAssetsFailed />;
    }

    return <AssetsLoading />;
  }

  return (
    hasAssets && (
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
