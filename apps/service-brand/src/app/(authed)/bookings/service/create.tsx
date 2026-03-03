import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useLayoutEffect, useMemo } from 'react';
import { CreateServiceBrandBooking } from '@symbiot-core-apps/brand-booking';
import { DateHelper, useI18n } from '@symbiot-core-apps/shared';

export default () => {
  const { t } = useI18n();
  const { start } = useLocalSearchParams<{ start?: string }>();
  const navigation = useNavigation();

  const adjustedStart = useMemo(
    () => DateHelper.roundTime(start || new Date(), 5),
    [start],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t(`service_brand_booking.create.new`),
    });
  }, [navigation, t]);

  return <CreateServiceBrandBooking start={adjustedStart} />;
};
