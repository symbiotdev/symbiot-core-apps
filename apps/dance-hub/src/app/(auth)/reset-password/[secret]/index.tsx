import { ResetPassword } from '@symbiot-core-apps/auth';
import { useLocalSearchParams } from 'expo-router';
import { AuthLogo } from '../../../../components/auth/auth-logo';

export default () => {
  const { secret } = useLocalSearchParams<{
    secret: string;
  }>();

  return <ResetPassword secret={secret} logo={<AuthLogo />} />;
};
