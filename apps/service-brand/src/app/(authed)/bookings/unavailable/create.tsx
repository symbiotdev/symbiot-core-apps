import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useLayoutEffect, useMemo } from 'react';
import { CreateUnavailableBrandBooking } from '@symbiot-core-apps/brand-booking';
import { DateHelper, useI18n } from '@symbiot-core-apps/shared';

export default () => {
  const { t } = useI18n();
  const { start } = useLocalSearchParams<{ start?: string }>();
  const navigation = useNavigation();

  const adjustedStart = useMemo(() => {
    return start
      ? DateHelper.roundTime(start, 5)
      : DateHelper.startOfDay(new Date());
  }, [start]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t(`unavailable_brand_booking.create.new`),
    });
  }, [navigation, t]);

  return <CreateUnavailableBrandBooking start={adjustedStart} />;
};
