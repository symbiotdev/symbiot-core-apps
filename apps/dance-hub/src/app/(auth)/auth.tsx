import { useOnboardingState } from '@symbiot-core-apps/store';
import { Redirect } from 'expo-router';
import { Auth } from '@symbiot-core-apps/auth';
import { useTranslation } from 'react-i18next';

export default () => {
  const { finished: onboardingFinished } = useOnboardingState();
  const { t } = useTranslation();

  if (!onboardingFinished) {
    return <Redirect href="onboarding" />;
  }

  return (
    <Auth
      textColor="white"
      blurhash="|02~GmIo00-p^+E1IU-pt7-oR*E1xu-pIoIo%2t79Zt7-;IoIU%MtRM{WB4-s:?bM{E1%2xuM{Rj%MWBRit7W;Rjs.ozS2-;RkD%xu%MM_RPtRfltRjZRiX8t7jFR*bIofE1s:%MM{M{%2t7IoayD%of-;M{E1%2%2IoR*"
      title={t('dance_hub.auth.title')}
      subtitle={t('dance_hub.auth.subtitle')}
      videoSource={require('../../../assets/video/auth/bg.mp4')}
      logoSource={require('../../../assets/images/icon/logo.png')}
    />
  );
};
