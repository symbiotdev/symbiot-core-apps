import { SignIn } from '@symbiot-core-apps/auth';
import { AuthLogo } from '../../../components/auth/auth-logo';

export default () => {
  return <SignIn logo={<AuthLogo />} />;
};
