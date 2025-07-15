import { useTranslation } from 'react-i18next';
import { AuthFormView } from './auth-form-view';
import { Controller, useForm } from 'react-hook-form';
import { AccountSignInData } from '@symbiot-core-apps/api';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { PasswordPattern } from '@symbiot-core-apps/shared';
import { ReactElement, useCallback } from 'react';
import { Input, Link, RegularText } from '@symbiot-core-apps/ui';
import { router } from 'expo-router';

export const SignIn = ({ logo }: { logo: ReactElement }) => {
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<AccountSignInData>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(
      yup
        .object()
        .shape({
          email: yup
            .string()
            .required(t('auth.sign_in.form.email.error.required'))
            .email(t('auth.sign_in.form.email.error.invalid_format')),
          password: yup
            .string()
            .required(t('auth.sign_in.form.password.error.required'))
            .matches(
              PasswordPattern,
              t('auth.sign_in.form.password.error.invalid_format')
            ),
        })
        .required()
    ),
  });

  const onSubmit = useCallback(async (data: AccountSignInData) => {
    console.log('data', data);
  }, []);

  const signUp = useCallback(() => {
    router.push('/sign-up');
  }, []);

  const forgotPassword = useCallback(() => {
    router.push('/forgot-password');
  }, []);

  return (
    <AuthFormView
      title={t('auth.sign_in.title')}
      subtitle={t('auth.sign_in.subtitle')}
      buttonLabel={t('shared.continue')}
      logo={logo}
      loading={isSubmitting}
      disabled={isSubmitting}
      externalLink={
        <RegularText textAlign="center">
          {t('auth.sign_in.external_link.already_have_account')}{' '}
          <Link disabled={isSubmitting} onPress={signUp}>
            {t('auth.sign_in.external_link.sign_up')}
          </Link>
        </RegularText>
      }
      onButtonPress={handleSubmit(onSubmit)}
    >
      <Controller
        control={control}
        name="email"
        render={({
          field: { value, onBlur, onChange },
          fieldState: { error },
        }) => (
          <Input
            value={value}
            error={error?.message}
            enterKeyHint="next"
            type="email"
            keyboardType="email-address"
            disabled={isSubmitting}
            label={t('auth.sign_in.form.email.label')}
            placeholder={t('auth.sign_in.form.email.placeholder')}
            onChange={onChange}
            onBlur={onBlur}
          />
        )}
      />

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
            enterKeyHint="next"
            type="password"
            disabled={isSubmitting}
            label={t('auth.sign_in.form.password.label')}
            placeholder={t('auth.sign_in.form.password.placeholder')}
            onChange={onChange}
            onBlur={onBlur}
          />
        )}
      />

      <Link
        alignSelf="flex-end"
        disabled={isSubmitting}
        onPress={forgotPassword}
      >
        {t('auth.sign_in.forgot_password_link')}
      </Link>
    </AuthFormView>
  );
};
