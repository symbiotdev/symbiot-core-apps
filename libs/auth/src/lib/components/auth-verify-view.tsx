import { InputCode, Link, RegularText } from '@symbiot-core-apps/ui';
import { AuthFormView } from './auth-form-view';
import { ReactElement, useCallback, useEffect, useState } from 'react';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

export const authCodeLength = 6;
export const verifySecondsLimit = 60;

export const AuthVerifyView = ({
  logo,
  email,
  error,
  loading,
  onResend,
  onChange,
}: {
  logo: ReactElement;
  email?: string;
  error?: string | null;
  loading?: boolean;
  onResend: () => Promise<void>;
  onChange: (code: string) => false | Promise<void>;
}) => {
  const { t } = useTranslation();

  const [secondsTo, setSecondsTo] = useState(verifySecondsLimit);

  const changeEmail = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/sign-up');
    }
  }, []);

  const resend = useCallback(async () => {
    await onResend();
    setSecondsTo(verifySecondsLimit);
  }, [onResend]);

  useEffect(() => {
    if (secondsTo <= 0) {
      return;
    }

    setTimeout(() => {
      const nextTick = secondsTo - 1;
      setSecondsTo(nextTick);
    }, 1000);
  }, [secondsTo]);

  return (
    <AuthFormView
      title={t('shared.auth.verify_email.title')}
      subtitle={t('shared.auth.verify_email.subtitle', {
        email: email || t('shared.auth.verify_email.your_email'),
      })}
      buttonLabel={`${t('shared.auth.verify_email.resend.button.label')}${
        secondsTo ? ` 00:${('0' + secondsTo).slice(-2)}` : ''
      }`}
      logo={logo}
      loading={loading}
      disabled={!!secondsTo || loading}
      error={error}
      externalLink={
        <RegularText textAlign="center">
          {t('shared.auth.verify_email.external_link.message')}{' '}
          <Link disabled={loading} onPress={changeEmail}>
            {t('shared.auth.verify_email.external_link.link')}
          </Link>
        </RegularText>
      }
      onButtonPress={resend}
    >
      <InputCode
        cellCount={authCodeLength}
        disabled={loading}
        onChange={onChange}
      />
    </AuthFormView>
  );
};
