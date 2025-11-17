import { HeaderButton, InitView } from '@symbiot-core-apps/ui';
import { useBrandServiceProfileByIdReq } from '@symbiot-core-apps/api';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import { XStack } from 'tamagui';
import { useCurrentBrandEmployee } from '@symbiot-core-apps/state';
import { BrandServiceProfile } from '@symbiot-core-apps/brand-service';

export default () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    data: service,
    isPending,
    error,
  } = useBrandServiceProfileByIdReq(id);
  const { hasPermission } = useCurrentBrandEmployee();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <XStack gap="$3" flex={1}>
          {/*todo - analytics*/}
          {/*{hasPermission('analytics') && (*/}
          {/*  <HeaderButton*/}
          {/*    iconName="ChartSquare"*/}
          {/*    onPress={() => router.push(`/services/${id}/analytics`)}*/}
          {/*  />*/}
          {/*)}*/}
          {hasPermission('catalog') && (
            <HeaderButton
              iconName="SettingsMinimalistic"
              onPress={() => router.push(`/services/${id}/update`)}
            />
          )}
        </XStack>
      ),
    });
  }, [hasPermission, id, navigation]);

  if (!service || error) {
    return <InitView loading={isPending} error={error} />;
  }

  return <BrandServiceProfile service={service} />;
};
