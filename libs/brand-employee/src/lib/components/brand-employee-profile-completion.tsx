import { BrandEmployee } from '@symbiot-core-apps/api';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { useIgnoredProfileCompletionState } from '@symbiot-core-apps/state';
import {
  DateHelper,
  secondsInHour,
  useI18n,
  useNativeNow,
} from '@symbiot-core-apps/shared';
import { useMemo } from 'react';
import { Button, formViewStyles, ProgressCard } from '@symbiot-core-apps/ui';
import { router } from 'expo-router';

export const BrandEmployeeProfileCompletion = ({
  employee,
}: {
  employee: BrandEmployee;
}) => {
  const { t } = useI18n();
  const { byEmployeeId, ignore } = useIgnoredProfileCompletionState();
  const { now } = useNativeNow({ intervalInSeconds: secondsInHour });

  const progress = useMemo(() => {
    let percentage = 0;

    if (employee.role) {
      percentage += 15;
    }

    if (employee.avatar) {
      percentage += 15;
    }

    if (employee.phones?.length) {
      percentage += 10;
    }

    if (employee.emails?.length) {
      percentage += 5;
    }

    if (employee.addresses?.length) {
      percentage += 5;
    }

    if (employee.locations?.length || employee.schedules?.length) {
      percentage += 20;
    }

    if (employee.about) {
      percentage += 10;
    }

    if (employee.birthday) {
      percentage += 10;
    }

    if (employee.gender) {
      percentage += 10;
    }

    return percentage;
  }, [employee]);

  const isVisible = useMemo(
    () =>
      progress < 100 &&
      (!byEmployeeId[employee.id] ||
        DateHelper.isAfter(now, byEmployeeId[employee.id])),
    [employee.id, byEmployeeId, now, progress],
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
          subtitle={t('brand_employee.completion.subtitle')}
          onClose={() =>
            ignore(
              'byEmployeeId',
              employee.id,
              DateHelper.addDays(new Date(), 30),
            )
          }
        >
          <Button
            label={t('brand_employee.completion.action.label')}
            onPress={() => router.push(`/employees/${employee.id}/update`)}
          />
        </ProgressCard>
      </Animated.View>
    )
  );
};
