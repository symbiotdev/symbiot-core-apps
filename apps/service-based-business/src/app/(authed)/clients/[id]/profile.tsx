import { HeaderButton, InitView } from '@symbiot-core-apps/ui';
import { BrandClientProfile } from '@symbiot-core-apps/brand-client';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useBrandClientDetailedByIdReq } from '@symbiot-core-apps/api';
import React, { useLayoutEffect } from 'react';
import { XStack } from 'tamagui';
import { useCurrentBrandEmployee } from '@symbiot-core-apps/state';

export default () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { hasPermission } = useCurrentBrandEmployee();
  const navigation = useNavigation();
  const {
    data: client,
    error,
    isPending,
  } = useBrandClientDetailedByIdReq(id);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <XStack gap="$3" flex={1}>
          {hasPermission('analytics') && (
            <HeaderButton
              iconName="ChartSquare"
              onPress={() => router.push(`/clients/${id}/analytics`)}
            />
          )}
          {hasPermission('clients') && (
            <HeaderButton
              iconName="SettingsMinimalistic"
              onPress={() => router.push(`/clients/${id}/update`)}
            />
          )}
        </XStack>
      ),
    });
  }, [hasPermission, id, navigation]);

  if (!client || error) {
    return <InitView loading={isPending} error={error} />;
  }

  return <BrandClientProfile client={client} />;
};
