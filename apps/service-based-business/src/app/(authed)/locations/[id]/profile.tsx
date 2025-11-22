import { HeaderButton, InitView } from '@symbiot-core-apps/ui';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import { useCurrentBrandEmployee } from '@symbiot-core-apps/state';
import { XStack } from 'tamagui';
import { useBrandLocationByIdReq } from '@symbiot-core-apps/api';
import { BrandLocationProfile } from '@symbiot-core-apps/brand-location';

export default () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { hasPermission } = useCurrentBrandEmployee();
  const navigation = useNavigation();
  const { data: location, isPending, error } = useBrandLocationByIdReq(id);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <XStack gap="$3" flex={1}>
          {/*todo - analytics*/}
          {/*{hasPermission('analytics') && (*/}
          {/*  <HeaderButton*/}
          {/*    iconName="ChartSquare"*/}
          {/*    onPress={() => router.push(`/locations/${id}/analytics`)}*/}
          {/*  />*/}
          {/*)}*/}
          {hasPermission('locations') && (
            <HeaderButton
              iconName="SettingsMinimalistic"
              onPress={() => router.push(`/locations/${id}/update`)}
            />
          )}
        </XStack>
      ),
    });
  }, [hasPermission, id, navigation]);

  if (!location) {
    return <InitView loading={isPending} error={error} />;
  }

  return <BrandLocationProfile location={location} />;
};
