import { VerifyForgotPassword } from '@symbiot-core-apps/auth';
import { useLocalSearchParams } from 'expo-router';

export default () => {
  const { secret, email } = useLocalSearchParams<{
    secret: string;
    email: string;
  }>();

  return (
    <VerifyForgotPassword
      secret={secret}
      email={email}
      logoSource={require('../../../../../assets/images/icon/logo.png')}
    />
  );
};
