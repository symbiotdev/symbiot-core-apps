import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import { useI18n } from '@symbiot-core-apps/shared';
import { EmptyView } from '@symbiot-core-apps/ui2';

export default () => {
  const { t } = useI18n();
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
