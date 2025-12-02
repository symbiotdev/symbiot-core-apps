import {
  PropsWithChildren,
  useCallback,
  useLayoutEffect,
  useState,
} from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import { mmkvGlobalStorage } from '@symbiot-core-apps/storage';
import { getLocales } from 'expo-localization';

const LANGUAGE_STORE_KEY = 'x-lang';
const fallbackLanguage = 'en';

void i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  fallbackLng: fallbackLanguage,
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

export const changeAppLanguageToSystem = () => {
  void i18n.changeLanguage(getPrimaryLanguage());
  mmkvGlobalStorage.remove(LANGUAGE_STORE_KEY);
};

const getPrimaryLanguage = () => {
  return (
    getLocales().find(
      ({ languageCode }) =>
        languageCode && i18n.languages.includes(languageCode),
    )?.languageCode ||
    i18n.languages[0] ||
    fallbackLanguage
  );
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

    i18n.languages = languages;

    languages.forEach((language) => {
      i18n.addResourceBundle(language, 'translation', translations[language]);
    });

    try {
      if (storedLanguage && !languages.includes(storedLanguage)) {
        changeAppLanguage(getPrimaryLanguage());
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
