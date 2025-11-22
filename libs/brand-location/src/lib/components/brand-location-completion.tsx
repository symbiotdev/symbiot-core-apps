import { BrandLocation } from '@symbiot-core-apps/api';
import { useMemo } from 'react';
import { useIgnoredProfileCompletionState } from '@symbiot-core-apps/state';
import {
  DateHelper,
  secondsInHour,
  useNativeNow,
} from '@symbiot-core-apps/shared';
import { Button, formViewStyles, ProgressCard } from '@symbiot-core-apps/ui';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

export const BrandLocationCompletion = ({
  location,
}: {
  location: BrandLocation;
}) => {
  const { t } = useTranslation();
  const { byLocationId, ignore } = useIgnoredProfileCompletionState();
  const { now } = useNativeNow(secondsInHour);

  const progress = useMemo(() => {
    let percentage = 0;

    if (location.name) {
      percentage += 10;
    }

    if (location.address) {
      percentage += 10;
    }

    if (location.avatar) {
      percentage += 15;
    }

    if (location.gallery?.length) {
      percentage += 15;
    }

    if (location.schedules?.length) {
      percentage += 10;
    }

    if (location.advantages?.length) {
      percentage += 10;
    }

    if (location.phones?.length) {
      percentage += 10;
    }

    if (location.emails?.length) {
      percentage += 5;
    }

    if (location.instagrams?.length) {
      percentage += 5;
    }

    if (location.entrance !== undefined) {
      percentage += 5;
    }

    if (location.floor !== undefined) {
      percentage += 5;
    }

    return percentage;
  }, [location]);

  const isVisible = useMemo(
    () =>
      progress < 100 &&
      (!byLocationId[location.id] ||
        DateHelper.isAfter(now, byLocationId[location.id])),
    [location.id, byLocationId, now, progress],
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
          subtitle={t('brand_location.completion.subtitle')}
          onClose={() =>
            ignore(
              'byLocationId',
              location.id,
              DateHelper.addDays(new Date(), 30),
            )
          }
        >
          <Button
            label={t('brand_location.completion.action.label')}
            onPress={() => router.push(`/locations/${location.id}/update`)}
          />
        </ProgressCard>
      </Animated.View>
    )
  );
};
