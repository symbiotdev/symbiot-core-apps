import { InputCode, Link, RegularText } from '@symbiot-core-apps/ui';
import { AuthFormView } from './auth-form-view';
import { useTranslation } from 'react-i18next';
import { ReactElement, useCallback, useEffect, useState } from 'react';
import { router } from 'expo-router';

const verifySecondsLimit = 59;

export const AuthVerifyView = ({
  email,
  logo,
  onResend,
  onChange,
}: {
  email?: string;
  logo: ReactElement;
  onResend: () => Promise<void>;
  onChange: (code: string) => Promise<void>;
}) => {
  const { t } = useTranslation();

  const [secondsTo, setSecondsTo] = useState(verifySecondsLimit);

  const verifying = false;
  const loading = false;
  const error = '';

  const onButtonPress = useCallback(async () => {}, []);

  const changeEmail = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/sign-up');
    }
  }, []);

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
      title={t('auth.verify_email.title')}
      subtitle={t('auth.verify_email.subtitle', {
        email: email || t('auth.verify_email.your_email'),
      })}
      buttonLabel={`${t('auth.verify_email.resend.button.label')}${
        secondsTo ? ` 00:${('0' + secondsTo).slice(-2)}` : ''
      }`}
      logo={logo}
      loading={loading}
      disabled={!!secondsTo || loading || verifying}
      externalLink={
        <RegularText textAlign="center">
          {t('auth.verify_email.external_link.message')}{' '}
          <Link disabled={loading} onPress={changeEmail}>
            {t('auth.verify_email.external_link.link')}
          </Link>
        </RegularText>
      }
      onButtonPress={onButtonPress}
    >
      <InputCode
        cellCount={6}
        error={error}
        disabled={loading}
        onChange={onChange}
      />

      {!error && (
        <RegularText textAlign="center">
          {t('auth.verify_email.resend.message')}
        </RegularText>
      )}
    </AuthFormView>
  );
};
