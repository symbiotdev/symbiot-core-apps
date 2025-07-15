import { ForgotPassword } from '@symbiot-core-apps/auth';
import { AuthLogo } from '../../../components/auth/auth-logo';

export default () => {
  return <ForgotPassword logo={<AuthLogo />} />;
};
