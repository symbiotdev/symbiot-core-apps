import { AppSettings } from '@symbiot-core-apps/api';

const languages = {
  uk: require('./i18n/uk.json'),
  en: require('./i18n/en.json'),
};

export const appSettings: AppSettings = {
  language: {
    default: 'en',
    translations: languages,
  },
};
