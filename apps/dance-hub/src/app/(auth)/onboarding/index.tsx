import { Onboarding, OnboardingSlide } from '@symbiot-core-apps/onboarding';
import { useMemo } from 'react';
import { useT } from '@symbiot-core-apps/i18n';

export default () => {
  const { t } = useT();

  const slides: OnboardingSlide[] = useMemo(
    () => [
      {
        id: '0',
        title: t('.onboarding.slides.slide0.title'),
        subtitle: t('.onboarding.slides.slide0.subtitle'),
        image: require('../../../../assets/images/onboarding/0.jpg'),
      },
      {
        id: '1',
        title: t('.onboarding.slides.slide1.title'),
        subtitle: t('.onboarding.slides.slide1.subtitle'),
        image: require('../../../../assets/images/onboarding/1.jpg'),
      },
      {
        id: '2',
        title: t('.onboarding.slides.slide2.title'),
        subtitle: t('.onboarding.slides.slide2.subtitle'),
        image: require('../../../../assets/images/onboarding/2.jpg'),
      },
      {
        id: '3',
        title: t('.onboarding.slides.slide3.title'),
        subtitle: t('.onboarding.slides.slide3.subtitle'),
        image: require('../../../../assets/images/onboarding/3.jpg'),
      },
    ],
    [],
  );

  return <Onboarding slides={slides} />;
};
