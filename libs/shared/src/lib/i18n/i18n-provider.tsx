import {
  I18nextProvider,
  initReactI18next,
  useTranslation,
} from 'react-i18next';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import i18n, { TFunction } from 'i18next';
import { getLocales } from 'expo-localization';
import { mmkvGlobalStorage } from '@symbiot-core-apps/storage';
import { merge } from 'merge-anything';

const LANGUAGE_STORE_KEY = 'x-lang';

type I18nContext = {
  t: TFunction;
  lang: string;
  supportedLanguages: string[];
  changeLanguage: (lang: string) => void;
  changeToDefaultLanguage: () => void;
  updateTranslates: (newTranslates: Record<string, unknown>) => void;
};

const Context = createContext<I18nContext | undefined>(undefined);

void i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  compatibilityJSON: 'v4',
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export const useI18n = () => useContext(Context) as I18nContext;
export const translate = (key: string) => i18n.t(key);
export const getAppLanguage = () => i18n.language;

export const I18nProvider = ({
  children,
  defaultLanguage,
  appTranslations,
}: PropsWithChildren<{
  defaultLanguage: string;
  appTranslations: Record<string, Record<string, unknown>>;
}>) => {
  const { t, i18n: i18nTranslation } = useTranslation();

  const [loaded, setLoaded] = useState(false);

  const { languages, primaryLang } = useMemo(() => {
    const languages = Object.keys(appTranslations);

    return {
      languages,
      primaryLang:
        getLocales().find(
          ({ languageCode }) =>
            languageCode && languages.includes(languageCode),
        )?.languageCode || defaultLanguage,
    };
  }, [appTranslations, defaultLanguage]);

  const defaultTranslations: Record<string, unknown> = useMemo(
    () =>
      languages.reduce(
        (obj, lang) => ({
          ...obj,
          [lang]: {
            ...appTranslations[lang],
            shared: loadShared(lang),
          },
        }),
        {},
      ),
    [appTranslations, languages],
  );

  const changeLanguage = useCallback((lang: string) => {
    void i18n.changeLanguage(lang);
    mmkvGlobalStorage.set(LANGUAGE_STORE_KEY, lang);
  }, []);

  const changeToDefaultLanguage = useCallback(() => {
    void i18n.changeLanguage(primaryLang);
    mmkvGlobalStorage.remove(LANGUAGE_STORE_KEY);
  }, [primaryLang]);

  const updateTranslates = useCallback(
    (newTranslations: Record<string, unknown>) => {
      const mergedJson = merge(defaultTranslations, newTranslations);

      Object.keys(defaultTranslations).forEach((lang) => {
        i18n.addResourceBundle(lang, 'translation', mergedJson[lang]);
      });
    },
    [defaultTranslations],
  );

  const init = useCallback(async () => {
    const storedLanguage = mmkvGlobalStorage.getString(LANGUAGE_STORE_KEY);

    try {
      Object.keys(defaultTranslations).forEach((lang) =>
        i18n.addResourceBundle(lang, 'translation', defaultTranslations[lang]),
      );

      if (storedLanguage && !languages.includes(storedLanguage)) {
        changeLanguage(primaryLang);
      } else {
        await i18n.changeLanguage(storedLanguage || primaryLang);
      }
    } catch (e) {
      console.log('i18n initialize error: ', e);
    } finally {
      setLoaded(true);
    }
  }, [defaultTranslations, languages, primaryLang, changeLanguage]);

  useLayoutEffect(() => {
    void init();
  }, [init]);

  return (
    <Context.Provider
      value={{
        t,
        supportedLanguages: languages,
        lang: i18nTranslation.language,
        changeLanguage,
        updateTranslates,
        changeToDefaultLanguage,
      }}
    >
      {loaded && <I18nextProvider i18n={i18n}>{children}</I18nextProvider>}
    </Context.Provider>
  );
};

export const allLanguages = [
  {
    name: 'English',
    shortName: 'Eng',
    flag: '🇺🇸',
    code: 'en',
  },
  {
    name: 'Українська',
    shortName: 'Укр',
    flag: '🇺🇦',
    code: 'uk',
  },
];

const loadShared = (lang: string) => {
  switch (lang) {
    case 'en':
      return require('./locale/en.json');
    case 'uk':
      return require('./locale/uk.json');
    default:
      return {};
  }
};
