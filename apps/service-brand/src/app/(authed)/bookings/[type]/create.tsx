import { useTranslation } from 'react-i18next';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import {
  BrandBookingType,
  getTranslateKeyByBrandBookingType,
} from '@symbiot-core-apps/api';
import { useLayoutEffect, useMemo } from 'react';
import {
  CreateServiceBrandBooking,
  CreateUnavailableBrandBooking,
} from '@symbiot-core-apps/brand-booking';
import { DateHelper } from '@symbiot-core-apps/shared';

export default () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { type, start } = useLocalSearchParams<{
    type: BrandBookingType;
    start?: string;
  }>();

  const adjustedStart = useMemo(() => {
    if (type === BrandBookingType.unavailable) {
      return start
        ? DateHelper.roundTime(start, 5)
        : DateHelper.startOfDay(new Date());
    }

    return DateHelper.roundTime(start || new Date(), 5);
  }, [start, type]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t(`${getTranslateKeyByBrandBookingType(type)}.create.new`),
    });
  }, [navigation, type, t]);

  if (type === BrandBookingType.unavailable) {
    return <CreateUnavailableBrandBooking start={adjustedStart} />;
  } else {
    return <CreateServiceBrandBooking start={adjustedStart} />;
  }
};
