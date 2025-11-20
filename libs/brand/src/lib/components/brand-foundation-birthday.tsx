import { ClosableCard } from '@symbiot-core-apps/ui';
import {
  useBirthdayState,
  useCurrentBrandState,
} from '@symbiot-core-apps/state';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { DateHelper, useNativeNow } from '@symbiot-core-apps/shared';
import { useMemo } from 'react';

export const BrandFoundationBirthday = () => {
  const { t } = useTranslation();
  const { brand } = useCurrentBrandState();
  const { now } = useNativeNow(60 * 60 * 1000);
  const { byBrandId, hide } = useBirthdayState();

  const brandId = brand?.id;
  const birthday = brand?.birthday;

  const isAnniversary = useMemo(
    () =>
      brandId &&
      birthday &&
      DateHelper.isSameDateIgnoringYear(birthday, now) &&
      !DateHelper.isSameDay(byBrandId[brandId], now),
    [byBrandId, birthday, brandId, now],
  );

  const congratsType = useMemo(
    () =>
      birthday && DateHelper.isSameDay(birthday, now)
        ? 'opening'
        : 'anniversary',
    [birthday, now],
  );

  return (
    isAnniversary && (
      <Animated.View entering={FadeInUp} exiting={FadeOutUp}>
        <ClosableCard
          iconName="Confetti"
          title={t(`brand.congrats.${congratsType}.title`)}
          subtitle={t(`brand.congrats.${congratsType}.message`, {
            brandName: brand?.name,
          })}
          onClose={() => hide('byBrandId', brandId as string)}
        />
      </Animated.View>
    )
  );
};
