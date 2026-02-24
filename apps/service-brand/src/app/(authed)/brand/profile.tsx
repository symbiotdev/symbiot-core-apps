import { useCurrentBrandEmployee } from '@symbiot-core-apps/state';
import React, { useLayoutEffect } from 'react';
import { XStack } from 'tamagui';
import { router, useNavigation } from 'expo-router';
import { CurrentBrandProfile } from '@symbiot-core-apps/brand';
import { HeaderButton, useSideMenu } from '@symbiot-core-apps/ui2';

export default () => {
  const { visible: sideMenuVisible } = useSideMenu();
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
  }, [sideMenuVisible, hasPermission, navigation]);

  return <CurrentBrandProfile />;
};
