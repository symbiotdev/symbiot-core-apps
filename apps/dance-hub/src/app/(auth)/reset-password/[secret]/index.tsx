import { ResetPassword } from '@symbiot-core-apps/auth';
import { useLocalSearchParams } from 'expo-router';

export default () => {
  const { secret } = useLocalSearchParams<{
    secret: string;
  }>();

  return (
    <ResetPassword
      secret={secret}
      logoSource={require('../../../../../assets/images/icon/logo.png')}
    />
  );
};
