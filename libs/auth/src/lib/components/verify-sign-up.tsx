import { ImageSource } from 'expo-image';
import { InputCode, Link, RegularText } from '@symbiot-core-apps/ui';
import { AuthFormView } from './auth-form-view';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useState } from 'react';
import { router } from 'expo-router';

const verifySecondsLimit = 59;

export const VerifySignUp = ({
  secret,
  email,
  logoSource,
}: {
  secret: string;
  email?: string;
  logoSource: ImageSource;
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

  const onChange = useCallback((code: string) => {
    console.log(code);
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
      title={t('auth.verify_sign_up.title')}
      subtitle={t('auth.verify_sign_up.subtitle', {
        email: email || t('auth.verify_sign_up.your_email'),
      })}
      buttonLabel={`${t('auth.verify_sign_up.resend.button.label')}${
        secondsTo ? ` 00:${('0' + secondsTo).slice(-2)}` : ''
      }`}
      logoSource={logoSource}
      loading={loading}
      disabled={!!secondsTo || loading || verifying}
      externalLink={
        <RegularText textAlign="center">
          {t('auth.verify_sign_up.external_link.message')}{' '}
          <Link disabled={loading} onPress={changeEmail}>
            {t('auth.verify_sign_up.external_link.link')}
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
          {t('auth.verify_sign_up.resend.message')}
        </RegularText>
      )}
    </AuthFormView>
  );
};
