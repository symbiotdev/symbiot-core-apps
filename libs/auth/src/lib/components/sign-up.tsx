import { Link, RegularText } from '@symbiot-core-apps/ui';
import {
  AccountSignUpData,
  useAccountAuthSignUpReq,
} from '@symbiot-core-apps/api';
import { useForm } from 'react-hook-form';
import { AuthFormView } from './auth-form-view';
import { ReactElement, useCallback } from 'react';
import {
  openBrowserAsync,
  WebBrowserPresentationStyle,
} from 'expo-web-browser';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import {
  CheckboxController,
  EmailController,
  PasswordController,
  StringController,
} from '@symbiot-core-apps/form-controller';

export const SignUp = ({ logo }: { logo: ReactElement }) => {
  const { t } = useTranslation();

  const { mutateAsync, error } = useAccountAuthSignUpReq();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    watch,
  } = useForm<
    AccountSignUpData & { confirmPassword: string; agreement: boolean }
  >({
    defaultValues: {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreement: false,
    },
  });

  const onSubmit = useCallback(
    async (data: AccountSignUpData) => {
      const { secret } = await mutateAsync(data);

      router.push({
        pathname: `/sign-up/${secret}/verify`,
        params: {
          email: data.email,
        },
      });
    },
    [mutateAsync],
  );

  const openPrivacyPolicy = useCallback(
    () =>
      openBrowserAsync(process.env.EXPO_PUBLIC_PRIVACY_POLICY_URL, {
        presentationStyle: WebBrowserPresentationStyle.PAGE_SHEET,
      }),
    [],
  );

  const openTermsConditions = useCallback(
    () =>
      openBrowserAsync(process.env.EXPO_PUBLIC_TERMS_CONDITIONS_URL, {
        presentationStyle: WebBrowserPresentationStyle.PAGE_SHEET,
      }),
    [],
  );

  const signIn = useCallback(() => {
    router.push('/sign-in');
  }, []);

  const { password } = watch();

  return (
    <AuthFormView
      title={t('shared.auth.sign_up.title')}
      subtitle={t('shared.auth.sign_up.subtitle')}
      buttonLabel={t('shared.continue')}
      logo={logo}
      loading={isSubmitting}
      disabled={isSubmitting}
      error={error}
      externalLink={
        <RegularText textAlign="center">
          {t('shared.auth.sign_up.external_link.already_have_account')}{' '}
          <Link disabled={isSubmitting} onPress={signIn}>
            {t('shared.auth.sign_up.external_link.sign_in')}
          </Link>
        </RegularText>
      }
      onButtonPress={handleSubmit(onSubmit)}
    >
      <StringController
        required
        name="firstname"
        control={control}
        label={t('shared.auth.sign_up.form.firstname.label')}
        placeholder={t('shared.auth.sign_up.form.firstname.placeholder')}
        rules={{
          required: t('shared.auth.sign_up.form.firstname.error.required'),
        }}
      />

      <StringController
        required
        name="lastname"
        control={control}
        label={t('shared.auth.sign_up.form.lastname.label')}
        placeholder={t('shared.auth.sign_up.form.lastname.placeholder')}
        rules={{
          required: t('shared.auth.sign_up.form.lastname.error.required'),
        }}
      />

      <EmailController
        required
        name="email"
        control={control}
        label={t('shared.auth.sign_up.form.email.label')}
        placeholder={t('shared.auth.sign_up.form.email.placeholder')}
        errors={{
          required: t('shared.auth.sign_up.form.email.error.required'),
          validation: t('shared.auth.sign_up.form.email.error.validation'),
        }}
      />

      <PasswordController
        required
        name="password"
        control={control}
        label={t('shared.auth.sign_up.form.password.label')}
        placeholder={t('shared.auth.sign_up.form.password.placeholder')}
        errors={{
          required: t('shared.auth.sign_up.form.password.error.required'),
          validation: t('shared.auth.sign_up.form.password.error.validation'),
        }}
      />

      <PasswordController
        required
        name="confirmPassword"
        matchTo={password}
        control={control}
        label={t('shared.auth.sign_up.form.confirm_password.label')}
        placeholder={t('shared.auth.sign_up.form.confirm_password.placeholder')}
        errors={{
          required: t(
            'shared.auth.sign_up.form.confirm_password.error.required',
          ),
          validation: t(
            'shared.auth.sign_up.form.confirm_password.error.validation',
          ),
          match: t('shared.auth.sign_up.form.confirm_password.error.match'),
        }}
      />

      <CheckboxController
        name="agreement"
        control={control}
        rules={{
          validate: (value) =>
            value
              ? true
              : t('shared.auth.sign_up.form.agreement.error.required'),
        }}
        label={
          <RegularText>
            {t('shared.auth.sign_up.form.agreement.prefix')}
            <Link onPress={openPrivacyPolicy}>
              {t('shared.docs.privacy_policy')}
            </Link>{' '}
            {t('and')}{' '}
            <Link onPress={openTermsConditions}>
              {t('shared.docs.terms_conditions')}
            </Link>
          </RegularText>
        }
      />
    </AuthFormView>
  );
};
