import { HeaderButton, PageView } from '@symbiot-core-apps/ui';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import { useCurrentBrandEmployee } from '@symbiot-core-apps/state';
import { XStack } from 'tamagui';

export default () => {
  const { id } = useLocalSearchParams();
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

  return <PageView />;
};
