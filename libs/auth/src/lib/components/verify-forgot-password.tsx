import { ImageSource } from 'expo-image';
import { useCallback } from 'react';
import { AuthVerifyView } from './auth-verify-view';

export const VerifyForgotPassword = ({
  secret,
  email,
  logoSource,
}: {
  secret: string;
  email?: string;
  logoSource: ImageSource;
}) => {
  const onChange = useCallback(async (code: string) => {
    console.log(code);
  }, []);

  const onResend = useCallback(async () => {}, []);

  return (
    <AuthVerifyView
      email={email}
      logoSource={logoSource}
      onChange={onChange}
      onResend={onResend}
    />
  );
};
