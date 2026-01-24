import { Brand } from '@symbiot-core-apps/api';
import { Button, formViewStyles, ProgressCard } from '@symbiot-core-apps/ui';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { useIgnoredProfileCompletionState } from '@symbiot-core-apps/state';
import { useMemo } from 'react';
import {
  DateHelper,
  secondsInHour,
  useI18n,
  useNativeNow,
} from '@symbiot-core-apps/shared';
import { router } from 'expo-router';

export const BrandProfileCompletion = ({
  brand,
  showAction,
}: {
  brand: Brand;
  showAction?: boolean;
}) => {
  const { t } = useI18n();
  const { byBrandId, ignore } = useIgnoredProfileCompletionState();
  const { now } = useNativeNow({ intervalInSeconds: secondsInHour });

  const progress = useMemo(() => {
    let percentage = 0;

    if (brand.name) {
      percentage += 25;
    }

    if (brand.avatar) {
      percentage += 25;
    }

    if (brand.about) {
      percentage += 15;
    }

    if (brand.birthday) {
      percentage += 15;
    }

    if (brand.websites?.length) {
      percentage += 10;
    }

    if (brand.instagrams?.length) {
      percentage += 10;
    }

    return percentage;
  }, [brand]);

  const isVisible = useMemo(
    () =>
      progress < 100 &&
      (!byBrandId[brand.id] || DateHelper.isAfter(now, byBrandId[brand.id])),
    [brand.id, byBrandId, now, progress],
  );

  return (
    isVisible && (
      <Animated.View
        style={formViewStyles}
        entering={FadeInUp}
        exiting={FadeOutUp}
      >
        <ProgressCard
          progress={progress}
          subtitle={t('brand.completion.subtitle')}
          onClose={() =>
            ignore('byBrandId', brand.id, DateHelper.addDays(new Date(), 30))
          }
        >
          {showAction && (
            <Button
              label={t('brand.completion.action.label')}
              onPress={() => router.push('/brand/update')}
            />
          )}
        </ProgressCard>
      </Animated.View>
    )
  );
};
