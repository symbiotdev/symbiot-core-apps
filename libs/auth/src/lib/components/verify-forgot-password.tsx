import { ReactElement, useCallback } from 'react';
import { AuthVerifyView } from './auth-verify-view';

export const VerifyForgotPassword = ({
  secret,
  email,
  logo,
}: {
  secret: string;
  email?: string;
  logo: ReactElement;
}) => {
  const onChange = useCallback(async (code: string) => {
    console.log(code);
  }, []);

  const onResend = useCallback(async () => {}, []);

  return (
    <AuthVerifyView
      email={email}
      logo={logo}
      onChange={onChange}
      onResend={onResend}
    />
  );
};
