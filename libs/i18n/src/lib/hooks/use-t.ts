import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';

const appNamespace = process.env['EXPO_PUBLIC_APP_TYPE'];

export const useT = () => {
  const { t, i18n } = useTranslation();

  const translate = useCallback(
    (
      key: string,
      params: Record<string, unknown> & {
        ns?: 'shared' | 'app';
      } = {},
    ) => {
      const { ns, ...args } = params;

      return t(
        `${params?.ns === 'app' ? appNamespace : 'shared'}.${key}`,
        args,
      );
    },
    [t],
  );

  return {
    lang: i18n.language,
    t: translate,
  };
};
