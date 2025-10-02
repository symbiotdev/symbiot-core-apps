import {
  useCurrentBrandEmployee,
  useCurrentBrandState,
} from '@symbiot-core-apps/state';
import React, { useLayoutEffect } from 'react';
import { HeaderButton, useDrawer } from '@symbiot-core-apps/ui';
import { XStack } from 'tamagui';
import { router, useNavigation } from 'expo-router';
import { BrandProfile } from '@symbiot-core-apps/brand';

export default () => {
  const { brand: currentBrand } = useCurrentBrandState();
  const { visible: drawerVisible } = useDrawer();
  const { hasPermission } = useCurrentBrandEmployee();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <XStack gap="$3">
          {!drawerVisible && hasPermission('analyticsAll') && (
            <HeaderButton
              iconName="ChartSquare"
              onPress={() => router.push(`/brand/analytics`)}
            />
          )}

          {hasPermission('brandAll') && (
            <HeaderButton
              iconName="SettingsMinimalistic"
              onPress={() => router.push(`/brand/update`)}
            />
          )}
        </XStack>
      ),
    });
  }, [currentBrand?.name, drawerVisible, hasPermission, navigation]);

  return currentBrand && <BrandProfile brand={currentBrand} />;
};
