import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import i18n from 'i18next';
import { enUS, Locale, uk } from 'date-fns/locale';

export const DATE_FNS_SUPPORTED_LANGUAGES: Record<string, Locale> = {
  en: enUS,
  uk: uk,
};

export const getDateLocale = () => {
  return DATE_FNS_SUPPORTED_LANGUAGES[i18n.language] || enUS;
};

export const useDateLocale = () => {
  const { i18n } = useTranslation();

  return useMemo(
    () => DATE_FNS_SUPPORTED_LANGUAGES[i18n.language],
    [i18n.language],
  );
};
