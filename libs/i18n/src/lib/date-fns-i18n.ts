import { enUS, Locale, uk } from 'date-fns/locale';
import { i18n } from './i18n';

export const getDateLocale = () => {
  return DATE_FNS_SUPPORTED_LANGUAGES[i18n.language] || enUS;
};

export const DATE_FNS_SUPPORTED_LANGUAGES: Record<string, Locale> = {
  en: enUS,
  uk: uk,
};
