import { AuthFormView } from './auth-form-view';
import { Controller, useForm } from 'react-hook-form';
import {
  AccountResetPasswordData,
  useAccountAuthResetPasswordQuery,
} from '@symbiot-core-apps/api';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { PasswordPattern } from '@symbiot-core-apps/shared';
import { ReactElement, useCallback } from 'react';
import { Input } from '@symbiot-core-apps/ui';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';

export const ResetPassword = ({ logo }: { logo: ReactElement }) => {
  const { t } = useTranslation();
  const { mutateAsync, error } = useAccountAuthResetPasswordQuery();
  const { secret, email, code } = useLocalSearchParams<{
    secret: string;
    email: string;
    code: string;
  }>();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<AccountResetPasswordData & { confirmPassword: string }>({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    resolver: yupResolver(
      yup
        .object()
        .shape({
          password: yup
            .string()
            .required(
              t('shared.auth.reset_password.form.password.error.required'),
            )
            .matches(
              PasswordPattern,
              t(
                'shared.auth.reset_password.form.password.error.validation',
              ),
            ),
          confirmPassword: yup
            .string()
            .required(
              t(
                'shared.auth.reset_password.form.confirm_password.error.required',
              ),
            )
            .oneOf(
              [yup.ref('password')],
              t('shared.auth.reset_password.form.confirm_password.error.match'),
            ),
        })
        .required(),
    ),
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
      <Controller
        control={control}
        name="password"
        render={({
          field: { value, onBlur, onChange },
          fieldState: { error },
        }) => (
          <Input
            value={value}
            error={error?.message}
            enterKeyHint="done"
            type="password"
            disabled={isSubmitting}
            label={t('shared.auth.reset_password.form.password.label')}
            placeholder={t(
              'shared.auth.reset_password.form.password.placeholder',
            )}
            onChange={onChange}
            onBlur={onBlur}
          />
        )}
      />

      <Controller
        control={control}
        name="confirmPassword"
        render={({
          field: { value, onBlur, onChange },
          fieldState: { error },
        }) => (
          <Input
            value={value}
            error={error?.message}
            enterKeyHint="done"
            type="password"
            disabled={isSubmitting}
            label={t('shared.auth.reset_password.form.confirm_password.label')}
            placeholder={t(
              'shared.auth.reset_password.form.confirm_password.placeholder',
            )}
            onChange={onChange}
            onBlur={onBlur}
          />
        )}
      />
    </AuthFormView>
  );
};
