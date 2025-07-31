import { Auth } from '@symbiot-core-apps/auth';
import { AuthLogo } from '../../../components/auth/auth-logo';
import { useT } from '@symbiot-core-apps/i18n';

export default () => {
  const { t } = useT();

  return (
    <Auth
      textColor="white"
      blurhash="|9C6if%M.7tQx]j]xvNFWG.8jX_4RjRiM_a#axRh?v%Nx^x]oztRj]M{RhtAWFtQ%NRibGt6n,fAW.WBkDogoNj]RiM^RiRja$a$WAk8ofa$V[ofxwWXW9WTn%j?axjvait3oHWBV@jbogWAf4j[f4ogo#W9j;j=aiohad"
      title={t('.auth.title', { ns: 'app' })}
      subtitle={t('.auth.subtitle', { ns: 'app' })}
      videoSource={require('../../../../assets/video/auth/bg.mp4')}
      logo={<AuthLogo />}
    />
  );
};
