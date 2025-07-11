import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { AppLanguage, supportedLanguages } from './app-language';

export const defaultLanguage =
  getLocales().find(({ languageCode }) =>
    supportedLanguages.includes(languageCode as AppLanguage),
  )?.languageCode || supportedLanguages[0];

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v4',
    resources: {
      en: {
        translation: require('./locale/en.json'),
      },
      uk: {
        translation: require('./locale/uk.json'),
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

const LANGUAGE_STORE_KEY = 'AppLang';

export const changeAppLanguage = (language: string) => {
  i18n.changeLanguage(language);
  AsyncStorage.setItem(LANGUAGE_STORE_KEY, language);
};

export const getStoredLanguage = () => {
  return AsyncStorage.getItem(LANGUAGE_STORE_KEY);
};

export { i18n };
