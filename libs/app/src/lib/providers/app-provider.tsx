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
  AppConfigFunctionality,
  AppConfigIconName,
  AppTranslations,
  useAppConfigReq,
  useAppTranslationsReq,
} from '@symbiot-core-apps/api';
import { IconName } from '@symbiot-core-apps/ui';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createZustandStorage } from '@symbiot-core-apps/storage';
import { isEqual } from '@symbiot-core-apps/shared';
import { LoadAssetsFailed } from '../components/load-assets-failed';
import { AssetsLoading } from '../components/assets-loading';

type AppState = {
  theme?: AppConfig['theme'];
  icons?: Record<AppConfigIconName, IconName>;
  languages?: AppTranslations['languages'];
  translations?: AppTranslations['translations'];
  functionality?: AppConfigFunctionality;
  setTheme: (theme: AppConfig['theme']) => void;
  setIcons: (icons: Record<AppConfigIconName, IconName>) => void;
  setTranslations: (translations: AppTranslations) => void;
  setFunctionality: (functionality: AppConfigFunctionality) => void;
};

type AppContext = {
  icons: Record<AppConfigIconName, IconName>;
  theme: AppConfig['theme'];
  functionality: AppConfigFunctionality;
  languages: AppTranslations['languages'];
};

const Context = createContext<AppContext | undefined>(undefined);
const useAppState = create<AppState>()(
  persist<AppState>(
    (set, get) => ({
      setTheme: (theme) => !isEqual(get().theme, theme) && set({ theme }),
      setIcons: (icons) => !isEqual(get().icons, icons) && set({ icons }),
      setFunctionality: (functionality) =>
        !isEqual(get().icons, functionality) && set({ functionality }),
      setTranslations: ({ translations, languages }) =>
        !isEqual(get().translations, translations) &&
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
    functionality,
    setIcons,
    setTheme,
    setTranslations,
    setFunctionality,
  } = useAppState();
  const { data: appConfig, error: appConfigError } = useAppConfigReq({
    refetch: !icons,
  });
  const { data: appTranslations, error: appTranslationError } =
    useAppTranslationsReq({
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
        setFunctionality(appConfig.functionality);
      }
    }

    if (appConfigError) {
      setLoadConfigFailed(true);
    }
  }, [appConfig, appConfigError, setFunctionality, setIcons, setTheme]);

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

  const hasAssets =
    !!icons && !!theme && !!languages && !!translations && functionality;

  if (!hasAssets) {
    if (loadConfigFailed || loadTranslationsFailed) {
      return <LoadAssetsFailed />;
    }

    return <AssetsLoading />;
  }

  return (
    hasAssets && (
      <Context.Provider value={{ icons, theme, languages, functionality }}>
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
