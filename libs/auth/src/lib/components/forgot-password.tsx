import { Link, RegularText } from '@symbiot-core-apps/ui';
import { AuthFormView } from './auth-form-view';
import { useForm } from 'react-hook-form';
import {
  AccountForgotPasswordData,
  useAccountAuthForgotPasswordReq,
} from '@symbiot-core-apps/api';
import { ReactElement, useCallback } from 'react';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { EmailController } from '@symbiot-core-apps/form-controller';

export const ForgotPassword = ({ logo }: { logo: ReactElement }) => {
  const { t } = useTranslation();
  const { mutateAsync, error } = useAccountAuthForgotPasswordReq();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<AccountForgotPasswordData>({
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = useCallback(
    async (data: AccountForgotPasswordData) => {
      const { secret } = await mutateAsync(data);

      router.push({
        pathname: `/forgot-password/${secret}/verify`,
        params: {
          email: data.email,
        },
      });
    },
    [mutateAsync],
  );

  const signUp = useCallback(() => {
    router.push('/sign-up');
  }, []);

  return (
    <AuthFormView
      title={t('shared.auth.forgot_password.title')}
      subtitle={t('shared.auth.forgot_password.subtitle')}
      buttonLabel={t('shared.continue')}
      logo={logo}
      loading={isSubmitting}
      disabled={isSubmitting}
      error={error}
      externalLink={
        <RegularText textAlign="center">
          {t('shared.auth.forgot_password.external_link.already_have_account')}{' '}
          <Link disabled={isSubmitting} onPress={signUp}>
            {t('shared.auth.forgot_password.external_link.sign_up')}
          </Link>
        </RegularText>
      }
      onButtonPress={handleSubmit(onSubmit)}
    >
      <EmailController
        required
        name="email"
        control={control}
        label={t('shared.auth.forgot_password.form.email.label')}
        placeholder={t('shared.auth.forgot_password.form.email.placeholder')}
        errors={{
          required: t('shared.auth.forgot_password.form.email.error.required'),
          validation: t(
            'shared.auth.forgot_password.form.email.error.validation',
          ),
        }}
      />
    </AuthFormView>
  );
};
