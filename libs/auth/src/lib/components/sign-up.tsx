import { Checkbox, Input, Link, RegularText } from '@symbiot-core-apps/ui';
import { AccountSignUpData } from '@symbiot-core-apps/api';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { PasswordPattern } from '@symbiot-core-apps/shared';
import { AuthFormView } from './auth-form-view';
import { ImageSource } from 'expo-image';
import { useCallback } from 'react';
import { XStack } from 'tamagui';
import {
  openBrowserAsync,
  WebBrowserPresentationStyle,
} from 'expo-web-browser';

export const SignUp = ({ logoSource }: { logoSource: ImageSource }) => {
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<
    AccountSignUpData & { confirmPassword: string; agreement: boolean }
  >({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      agreement: false,
    },
    resolver: yupResolver(
      yup
        .object()
        .shape({
          email: yup
            .string()
            .required(t('auth.sign_up.form.email.error.required'))
            .email(t('auth.sign_up.form.email.error.invalid_format')),
          password: yup
            .string()
            .required(t('auth.sign_up.form.password.error.required'))
            .matches(
              PasswordPattern,
              t('auth.sign_up.form.password.error.invalid_format')
            ),
          confirmPassword: yup
            .string()
            .required(t('auth.sign_up.form.confirm_password.error.required'))
            .oneOf(
              [yup.ref('password')],
              t('auth.sign_up.form.confirm_password.error.match')
            ),
          agreement: yup
            .boolean()
            .test(
              'validate-agreement',
              t('auth.sign_up.form.agreement.error.required'),
              function (value) {
                return !!value;
              }
            )
            .required(),
        })
        .required()
    ),
  });

  const onSubmit = useCallback(async (data: AccountSignUpData) => {
    console.log('data', data);
  }, []);

  const openPrivacyPolicy = useCallback(
    () =>
      openBrowserAsync(process.env.EXPO_PUBLIC_PRIVACY_POLICY_URL, {
        presentationStyle: WebBrowserPresentationStyle.PAGE_SHEET,
      }),
    []
  );

  const openTermsConditions = useCallback(
    () =>
      openBrowserAsync(process.env.EXPO_PUBLIC_TERMS_CONDITIONS_URL, {
        presentationStyle: WebBrowserPresentationStyle.PAGE_SHEET,
      }),
    []
  );

  return (
    <AuthFormView
      title={t('auth.sign_up.title')}
      subtitle={t('auth.sign_up.subtitle')}
      buttonLabel={t('shared.continue')}
      logoSource={logoSource}
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
            label={t('auth.sign_up.form.email.label')}
            placeholder={t('auth.sign_up.form.email.placeholder')}
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
            label={t('auth.sign_up.form.password.label')}
            placeholder={t('auth.sign_up.form.password.placeholder')}
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
            label={t('auth.sign_up.form.confirm_password.label')}
            placeholder={t('auth.sign_up.form.confirm_password.placeholder')}
            onChange={onChange}
            onBlur={onBlur}
          />
        )}
      />

      <Controller
        control={control}
        name="agreement"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <XStack gap="$3" alignItems="center">
            <Checkbox
              value={value}
              error={error?.message}
              label={
                <RegularText>
                  {t('auth.sign_up.form.agreement.prefix')}
                  <Link onPress={openPrivacyPolicy}>
                    {t('shared.docs.privacy_policy')}
                  </Link>{' '}
                  {t('shared.and')}{' '}
                  <Link onPress={openTermsConditions}>
                    {t('shared.docs.terms_conditions')}
                  </Link>
                </RegularText>
              }
              onChange={onChange}
            />
          </XStack>
        )}
      />
    </AuthFormView>
  );
};
