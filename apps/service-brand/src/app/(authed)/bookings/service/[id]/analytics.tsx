import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import { useI18n } from '@symbiot-core-apps/shared';
import { EmptyView } from '@symbiot-core-apps/ui2';

export default () => {
  const { t } = useI18n();
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t(`service_brand_booking.analytics.title`),
    });
  }, [navigation, t]);

  return <EmptyView />;
};
