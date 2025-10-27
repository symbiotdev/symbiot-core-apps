import { EmptyView } from '@symbiot-core-apps/ui';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import {
  BrandBookingType,
  getTranslateKeyByBrandBookingType,
} from '@symbiot-core-apps/api';
import React, { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { id, type } = useLocalSearchParams<{
    id: string;
    type: BrandBookingType;
  }>();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t(`${getTranslateKeyByBrandBookingType(type)}.update.title`),
    });
  }, [navigation, type, t]);

  return <EmptyView />;
};
