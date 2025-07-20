import { ReactElement, useCallback } from 'react';
import { AuthVerifyView } from './auth-verify-view';
import {
  useAccountAuthResendSignUpCodeQuery,
  useAccountAuthVerifySignUpQuery,
} from '@symbiot-core-apps/api';

export const VerifySignUp = ({
  secret,
  email,
  logo,
}: {
  secret: string;
  email: string;
  logo: ReactElement;
}) => {
  const {
    mutateAsync: resendCode,
    error: resendCodeError,
    isPending: isCodeResending,
  } = useAccountAuthResendSignUpCodeQuery();
  const {
    mutateAsync: verify,
    error: verifyError,
    isPending: isVerifying,
  } = useAccountAuthVerifySignUpQuery();

  const onChange = useCallback(
    (code: string) =>
      verify({
        code,
        secret,
      }),
    [secret, verify]
  );

  const onResend = useCallback(
    () =>
      resendCode({
        secret,
        email,
      }),
    [email, resendCode, secret]
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
