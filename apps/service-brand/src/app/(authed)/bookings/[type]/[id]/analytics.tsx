import { EmptyView } from '@symbiot-core-apps/ui';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import {
  BrandBookingType,
  getTranslateKeyByBrandBookingType,
} from '@symbiot-core-apps/api';
import React, { useLayoutEffect } from 'react';
import { useI18n } from '@symbiot-core-apps/shared';

export default () => {
  const { t } = useI18n();
  const navigation = useNavigation();
  const { id, type } = useLocalSearchParams<{
    id: string;
    type: BrandBookingType;
  }>();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t(
        `${getTranslateKeyByBrandBookingType(type)}.analytics.title`,
      ),
    });
  }, [navigation, type, t]);

  return <EmptyView />;
};
