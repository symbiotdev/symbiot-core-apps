import { Onboarding, OnboardingSlide } from '@symbiot-core-apps/onboarding';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useOnboardingState } from '@symbiot-core-apps/store';
import { Redirect } from 'expo-router';

export default () => {
  const { t } = useTranslation();
  const { finished: onboardingFinished } = useOnboardingState();

  const slides: OnboardingSlide[] = useMemo(
    () => [
      {
        id: '0',
        title: t('spanday.onboarding.slides.slide0.title'),
        subtitle: t('spanday.onboarding.slides.slide0.subtitle'),
        image: require('../../../../assets/images/onboarding/0.jpg'),
      },
      {
        id: '1',
        title: t('spanday.onboarding.slides.slide1.title'),
        subtitle: t('spanday.onboarding.slides.slide1.subtitle'),
        image: require('../../../../assets/images/onboarding/1.jpg'),
      },
      {
        id: '2',
        title: t('spanday.onboarding.slides.slide2.title'),
        subtitle: t('spanday.onboarding.slides.slide2.subtitle'),
        image: require('../../../../assets/images/onboarding/2.jpg'),
      },
      {
        id: '3',
        title: t('spanday.onboarding.slides.slide3.title'),
        subtitle: t('spanday.onboarding.slides.slide3.subtitle'),
        image: require('../../../../assets/images/onboarding/3.jpg'),
      },
    ],
    []
  );

  if (onboardingFinished) {
    return <Redirect href="auth" />;
  }

  return <Onboarding slides={slides} />;
};
