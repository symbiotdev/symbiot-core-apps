import { ResetPassword } from '@symbiot-core-apps/auth';
import { useLocalSearchParams } from 'expo-router';
import { AuthLogo } from '../../../../components/auth/auth-logo';

export default () => {
  const { secret, email, code } = useLocalSearchParams<{
    secret: string;
    email: string;
    code: string;
  }>();

  return (
    <ResetPassword
      secret={secret}
      email={email}
      code={code}
      logo={<AuthLogo />}
    />
  );
};
