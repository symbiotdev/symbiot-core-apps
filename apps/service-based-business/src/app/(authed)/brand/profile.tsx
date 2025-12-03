import { useCurrentBrandEmployee } from '@symbiot-core-apps/state';
import React, { useLayoutEffect } from 'react';
import { HeaderButton, useDrawer } from '@symbiot-core-apps/ui';
import { XStack } from 'tamagui';
import { router, useNavigation } from 'expo-router';
import { CurrentBrandProfile } from '@symbiot-core-apps/brand';

export default () => {
  const { visible: drawerVisible } = useDrawer();
  const { hasPermission } = useCurrentBrandEmployee();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <XStack flex={1} gap="$3" alignItems="center">
          {/*todo - analytics*/}
          {/*{!drawerVisible && hasPermission('analytics') && (*/}
          {/*  <HeaderButton*/}
          {/*    iconName="ChartSquare"*/}
          {/*    onPress={() => router.push(`/brand/analytics`)}*/}
          {/*  />*/}
          {/*)}*/}

          {hasPermission('brand') && (
            <HeaderButton
              iconName="SettingsMinimalistic"
              onPress={() => router.push(`/brand/update`)}
            />
          )}
        </XStack>
      ),
    });
  }, [drawerVisible, hasPermission, navigation]);

  return <CurrentBrandProfile />;
};
