import { AuthFormView } from './auth-form-view';
import { useForm } from 'react-hook-form';
import {
  AccountResetPasswordData,
  useAccountAuthResetPasswordReq,
} from '@symbiot-core-apps/api';
import { ReactElement, useCallback } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { PasswordController } from '@symbiot-core-apps/form-controller';

export const ResetPassword = ({ logo }: { logo: ReactElement }) => {
  const { t } = useTranslation();
  const { mutateAsync, error } = useAccountAuthResetPasswordReq();
  const { secret, email, code } = useLocalSearchParams<{
    secret: string;
    email: string;
    code: string;
  }>();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    watch,
  } = useForm<AccountResetPasswordData & { confirmPassword: string }>({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = useCallback(
    async (data: AccountResetPasswordData) =>
      mutateAsync({
        secret,
        password: data.password,
        email,
        code,
      }),
    [code, email, mutateAsync, secret],
  );

  const { password } = watch();

  return (
    <AuthFormView
      title={t('shared.auth.reset_password.title')}
      subtitle={t('shared.auth.reset_password.subtitle')}
      buttonLabel={t('shared.continue')}
      logo={logo}
      loading={isSubmitting}
      disabled={isSubmitting}
      error={error}
      onButtonPress={handleSubmit(onSubmit)}
    >
      <PasswordController
        required
        name="password"
        control={control}
        label={t('shared.auth.reset_password.form.password.label')}
        placeholder={t('shared.auth.reset_password.form.password.placeholder')}
        errors={{
          required: t(
            'shared.auth.reset_password.form.password.error.required',
          ),
          validation: t(
            'shared.auth.reset_password.form.password.error.validation',
          ),
        }}
      />

      <PasswordController
        required
        name="confirmPassword"
        matchTo={password}
        control={control}
        label={t('shared.auth.reset_password.form.confirm_password.label')}
        placeholder={t(
          'shared.auth.reset_password.form.confirm_password.placeholder',
        )}
        errors={{
          required: t(
            'shared.auth.reset_password.form.confirm_password.error.required',
          ),
          validation: t(
            'shared.auth.reset_password.form.confirm_password.error.validation',
          ),
          match: t(
            'shared.auth.reset_password.form.confirm_password.error.match',
          ),
        }}
      />
    </AuthFormView>
  );
};
