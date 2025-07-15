import { useOnboardingState } from '@symbiot-core-apps/store';
import { Redirect } from 'expo-router';
import { Auth } from '@symbiot-core-apps/auth';
import { useTranslation } from 'react-i18next';
import { AuthLogo } from '../../../components/auth/auth-logo';

export default () => {
  const { finished: onboardingFinished } = useOnboardingState();
  const { t } = useTranslation();

  if (!onboardingFinished) {
    return <Redirect href="onboarding" />;
  }

  return (
    <Auth
      textColor="white"
      blurhash="|9C6if%M.7tQx]j]xvNFWG.8jX_4RjRiM_a#axRh?v%Nx^x]oztRj]M{RhtAWFtQ%NRibGt6n,fAW.WBkDogoNj]RiM^RiRja$a$WAk8ofa$V[ofxwWXW9WTn%j?axjvait3oHWBV@jbogWAf4j[f4ogo#W9j;j=aiohad"
      title={t('dance_hub.auth.title')}
      subtitle={t('dance_hub.auth.subtitle')}
      videoSource={require('../../../../assets/video/auth/bg.mp4')}
      logo={<AuthLogo />}
    />
  );
};
