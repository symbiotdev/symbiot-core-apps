import { Auth } from '@symbiot-core-apps/auth';
import { AdaptiveLogo } from '../../../components/auth/adaptive-logo';
import { useTranslation } from 'react-i18next';

export default () => {
  const { t } = useTranslation();

  return (
    <Auth
      textColor="white"
      blurhash="|9C6if%M.7tQx]j]xvNFWG.8jX_4RjRiM_a#axRh?v%Nx^x]oztRj]M{RhtAWFtQ%NRibGt6n,fAW.WBkDogoNj]RiM^RiRja$a$WAk8ofa$V[ofxwWXW9WTn%j?axjvait3oHWBV@jbogWAf4j[f4ogo#W9j;j=aiohad"
      title={t('auth.title')}
      subtitle={t('auth.subtitle')}
      videoSource={require('../../../../assets/video/auth/bg.mp4')}
      logo={<AdaptiveLogo forceDark />}
    />
  );
};
