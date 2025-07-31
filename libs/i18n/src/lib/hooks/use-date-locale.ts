import { useMemo } from 'react';
import i18n from 'i18next';
import { enUS, Locale, uk } from 'date-fns/locale';
import { useT } from './use-t';

export const DATE_FNS_SUPPORTED_LANGUAGES: Record<string, Locale> = {
  en: enUS,
  uk: uk,
};

export const getDateLocale = () => {
  return DATE_FNS_SUPPORTED_LANGUAGES[i18n.language] || enUS;
};

export const useDateLocale = () => {
  const { lang } = useT();

  return useMemo(() => DATE_FNS_SUPPORTED_LANGUAGES[lang], [lang]);
};
