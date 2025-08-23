import {
  PropsWithChildren,
  useCallback,
  useLayoutEffect,
  useState,
} from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import { mmkvGlobalStorage } from '@symbiot-core-apps/storage';

const LANGUAGE_STORE_KEY = 'x-lang';
const fallbackLanguage = 'en';

void i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  fallbackLng:
    mmkvGlobalStorage.getString(LANGUAGE_STORE_KEY) || fallbackLanguage,
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export const changeAppLanguage = (language: string) => {
  void i18n.changeLanguage(language);
  mmkvGlobalStorage.set(LANGUAGE_STORE_KEY, language);
};

export type Translations = {
  [key: string]: string | Translations;
};

export const I18nProvider = ({
  children,
  translations,
}: PropsWithChildren<{
  translations: Translations;
}>) => {
  const [loaded, setLoaded] = useState(false);

  const init = useCallback(async () => {
    const languages = Object.keys(translations);
    const storedLanguage = mmkvGlobalStorage.getString(LANGUAGE_STORE_KEY);
    const primaryLanguage =
      languages.find((language) => language === fallbackLanguage) ||
      languages[0];

    languages.forEach((language) => {
      i18n.addResourceBundle(language, 'translation', translations[language]);
    });

    try {
      if (storedLanguage && !languages.includes(storedLanguage)) {
        changeAppLanguage(primaryLanguage);
      } else {
        await i18n.changeLanguage(storedLanguage);
      }
    } finally {
      setLoaded(true);
    }
  }, [translations]);

  useLayoutEffect(() => {
    void init();
  }, [init]);

  return <I18nextProvider i18n={i18n}>{loaded && children}</I18nextProvider>;
};
