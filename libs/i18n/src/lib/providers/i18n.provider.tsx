import {
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { getLocales } from 'expo-localization';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import { AppLanguage, supportedLanguages } from '../utils/app-language';
import { mmkvGlobalStorage } from '@symbiot-core-apps/storage';

const defaultLanguage =
  getLocales().find(({ languageCode }) =>
    supportedLanguages.includes(languageCode as AppLanguage),
  )?.languageCode || supportedLanguages[0];

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v4',
    resources: {
      en: {
        translation: require('../locale/en.json'),
      },
      uk: {
        translation: require('../locale/uk.json'),
      },
    },
    lng: defaultLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  })
  .catch((error) => {
    console.error('Error i18n:', error);
  });

const LANGUAGE_STORE_KEY = 'x-lang';
const Context = createContext({});

export const changeAppLanguage = (language: string) => {
  void i18n.changeLanguage(language);
  mmkvGlobalStorage.set(LANGUAGE_STORE_KEY, language);
};

export const I18nProvider = ({ children }: PropsWithChildren) => {
  const [loaded, setLoaded] = useState(false);

  const init = useCallback(async () => {
    try {
      const language = mmkvGlobalStorage.getString(LANGUAGE_STORE_KEY);

      await i18n.changeLanguage(language || defaultLanguage);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    void init();
  }, [init]);

  return (
    <Context.Provider value={{}}>
      <I18nextProvider i18n={i18n}>{loaded && children}</I18nextProvider>
    </Context.Provider>
  );
};

export { i18n };
