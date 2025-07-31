import { ReactElement, useCallback } from 'react';
import { AuthVerifyView } from './auth-verify-view';
import {
  useAccountAuthResendForgotPasswordCodeQuery,
  useAccountAuthVerifyForgotPasswordQuery,
} from '@symbiot-core-apps/api';
import { router, useLocalSearchParams } from 'expo-router';

export const VerifyForgotPassword = ({ logo }: { logo: ReactElement }) => {
  const {
    mutateAsync: resendCode,
    error: resendCodeError,
    isPending: isCodeResending,
  } = useAccountAuthResendForgotPasswordCodeQuery();
  const {
    mutateAsync: verify,
    error: verifyError,
    isPending: isVerifying,
  } = useAccountAuthVerifyForgotPasswordQuery();
  const { secret, email } = useLocalSearchParams<{
    secret: string;
    email: string;
  }>();

  const onChange = useCallback(
    async (code: string) => {
      await verify({
        code,
        secret,
        email,
      });

      router.push({
        pathname: `/reset-password/${secret}`,
        params: {
          email,
          code,
        },
      });
    },
    [email, secret, verify],
  );

  const onResend = useCallback(
    () =>
      resendCode({
        secret,
        email,
      }),
    [email, resendCode, secret],
  );

  return (
    <AuthVerifyView
      loading={isCodeResending || isVerifying}
      email={email}
      error={resendCodeError || verifyError}
      logo={logo}
      onChange={onChange}
      onResend={onResend}
    />
  );
};
