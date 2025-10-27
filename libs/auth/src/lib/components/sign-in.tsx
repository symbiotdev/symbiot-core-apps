import { AuthFormView } from './auth-form-view';
import { useForm } from 'react-hook-form';
import {
  AccountSignInData,
  useAccountAuthSignInReq,
} from '@symbiot-core-apps/api';
import { ReactElement, useCallback } from 'react';
import { Link, RegularText } from '@symbiot-core-apps/ui';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import {
  EmailController,
  PasswordController,
} from '@symbiot-core-apps/form-controller';

export const SignIn = ({ logo }: { logo: ReactElement }) => {
  const { t } = useTranslation();
  const { mutateAsync, error } = useAccountAuthSignInReq();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<AccountSignInData>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = useCallback(
    (data: AccountSignInData) => mutateAsync(data),
    [mutateAsync],
  );

  const signUp = useCallback(() => {
    router.push('/sign-up');
  }, []);

  const forgotPassword = useCallback(() => {
    router.push('/forgot-password');
  }, []);

  return (
    <AuthFormView
      title={t('shared.auth.sign_in.title')}
      subtitle={t('shared.auth.sign_in.subtitle')}
      buttonLabel={t('shared.continue')}
      logo={logo}
      loading={isSubmitting}
      disabled={isSubmitting}
      error={error}
      externalLink={
        <RegularText textAlign="center">
          {t('shared.auth.sign_in.external_link.already_have_account')}{' '}
          <Link disabled={isSubmitting} onPress={signUp}>
            {t('shared.auth.sign_in.external_link.sign_up')}
          </Link>
        </RegularText>
      }
      onButtonPress={handleSubmit(onSubmit)}
    >
      <EmailController
        required
        name="email"
        control={control}
        label={t('shared.auth.sign_in.form.email.label')}
        placeholder={t('shared.auth.sign_in.form.email.placeholder')}
        errors={{
          required: t('shared.auth.sign_in.form.email.error.required'),
          validation: t('shared.auth.sign_in.form.email.error.validation'),
        }}
      />

      <PasswordController
        required
        name="password"
        control={control}
        label={t('shared.auth.sign_in.form.password.label')}
        placeholder={t('shared.auth.sign_in.form.password.placeholder')}
        errors={{
          required: t('shared.auth.sign_in.form.password.error.required'),
          validation: t('shared.auth.sign_in.form.password.error.validation'),
        }}
      />

      <Link
        alignSelf="flex-end"
        disabled={isSubmitting}
        onPress={forgotPassword}
      >
        {t('shared.auth.sign_in.forgot_password_link')}
      </Link>
    </AuthFormView>
  );
};
