import { ImageSource } from 'expo-image';
import { Input, Link, RegularText } from '@symbiot-core-apps/ui';
import { AuthFormView } from './auth-form-view';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import { AccountForgotPasswordData } from '@symbiot-core-apps/api';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useCallback } from 'react';
import { router } from 'expo-router';

export const ForgotPassword = ({ logoSource }: { logoSource: ImageSource }) => {
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<AccountForgotPasswordData>({
    defaultValues: {
      email: '',
    },
    resolver: yupResolver(
      yup
        .object()
        .shape({
          email: yup
            .string()
            .required(t('auth.forgot_password.form.email.error.required'))
            .email(t('auth.forgot_password.form.email.error.invalid_format')),
        })
        .required()
    ),
  });

  const onSubmit = useCallback(async (data: AccountForgotPasswordData) => {
    console.log('data', data);
  }, []);

  const signUp = useCallback(() => {
    router.push('/sign-up');
  }, []);

  return (
    <AuthFormView
      title={t('auth.forgot_password.title')}
      subtitle={t('auth.forgot_password.subtitle')}
      buttonLabel={t('shared.continue')}
      logoSource={logoSource}
      loading={isSubmitting}
      disabled={isSubmitting}
      externalLink={
        <RegularText textAlign="center">
          {t('auth.forgot_password.external_link.already_have_account')}{' '}
          <Link disabled={isSubmitting} onPress={signUp}>
            {t('auth.forgot_password.external_link.sign_up')}
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
            label={t('auth.forgot_password.form.email.label')}
            placeholder={t('auth.forgot_password.form.email.placeholder')}
            onChange={onChange}
            onBlur={onBlur}
          />
        )}
      />
    </AuthFormView>
  );
};
