import { ClosableCard, compactViewStyles } from '@symbiot-core-apps/ui';
import { useAnniversaryState } from '@symbiot-core-apps/state';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import {
  DateHelper,
  secondsInHour,
  useI18n,
  useNativeNow,
} from '@symbiot-core-apps/shared';
import { useMemo } from 'react';
import { Brand } from '@symbiot-core-apps/api';

export const BrandCongrats = ({ brand }: { brand: Brand }) => {
  const { t } = useI18n();
  const { now } = useNativeNow({ intervalInSeconds: secondsInHour });
  const { byBrandId: anniversaryById, hide: hideAnniversary } =
    useAnniversaryState();

  const isAnniversaryToday = useMemo(
    () =>
      brand.birthday &&
      DateHelper.isSameDateIgnoringYear(brand.birthday, now) &&
      !DateHelper.isSameDay(brand.birthday, now) &&
      !DateHelper.isSameDay(anniversaryById[brand.id], now),
    [anniversaryById, brand.birthday, brand.id, now],
  );

  return (
    isAnniversaryToday && (
      <Animated.View
        style={compactViewStyles}
        entering={FadeInUp}
        exiting={FadeOutUp}
      >
        <ClosableCard
          iconName="Confetti"
          title={t(`brand.congrats.anniversary.title`)}
          subtitle={t(`brand.congrats.anniversary.message`, {
            brandName: brand?.name,
          })}
          onClose={() => hideAnniversary('byBrandId', brand.id)}
        />
      </Animated.View>
    )
  );
};
