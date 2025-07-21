import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { DATE_FNS_SUPPORTED_LANGUAGES } from '../date-fns-i18n';

export const useDateLocale = () => {
  const {i18n} = useTranslation();

  return useMemo(() => DATE_FNS_SUPPORTED_LANGUAGES[i18n.language], [i18n.language]);
}
