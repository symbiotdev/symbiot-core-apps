import { VerifySignUp } from '@symbiot-core-apps/auth';
import { useLocalSearchParams } from 'expo-router';
import { AuthLogo } from '../../../../components/auth/auth-logo';

export default () => {
  const { secret, email } = useLocalSearchParams<{
    secret: string;
    email: string;
  }>();

  return <VerifySignUp secret={secret} email={email} logo={<AuthLogo />} />;
};
