import { EmptyView } from '@symbiot-core-apps/ui';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  useLayoutEffect(() => {
    navigation.setOptions({
      // headerTitle: t(`${getTranslateKeyByBrandMembershipType(type)}.analytics.title`),
    });
  }, [navigation, t]);

  return <EmptyView />;
};
