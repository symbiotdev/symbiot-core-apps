import {
  Avatar,
  Button,
  H2,
  H3,
  HeaderButton,
  headerButtonSize,
  Icon,
  TabsPageView,
} from '@symbiot-core-apps/ui';
import { View, XStack } from 'tamagui';
import {
  useCurrentBrandEmployee,
  useCurrentBrandState,
} from '@symbiot-core-apps/state';
import { router, useNavigation } from 'expo-router';
import React, { useLayoutEffect } from 'react';

export default () => {
  const { brand: currentBrand } = useCurrentBrandState();
  const navigation = useNavigation();
  const { hasPermission, hasAnyPermission } = useCurrentBrandEmployee();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () =>
        currentBrand?.name && (
          <H3 lineHeight={headerButtonSize} numberOfLines={1}>
            {currentBrand.name}
          </H3>
        ),
      headerRight: () => (
        <XStack gap="$3">
          {hasPermission('analyticsAll') && (
            <HeaderButton
              iconName="ChartSquare"
              onPress={() => router.push(`/brand/analytics`)}
            />
          )}
          {hasAnyPermission() && (
            <HeaderButton
              iconName="SettingsMinimalistic"
              onPress={() => router.push(`/brand/menu`)}
            />
          )}
        </XStack>
      ),
    });
  }, [currentBrand?.name, hasAnyPermission, hasPermission, navigation]);

  return (
    <TabsPageView gap="$3">
      {!!currentBrand && (
        <View margin="auto" alignItems="center" gap="$2">
          <Avatar
            name={currentBrand.name}
            size={80}
            url={currentBrand.avatarXsUrl}
            color={currentBrand.avatarColor}
          />

          <H2 numberOfLines={1} textAlign="center">
            {currentBrand.name}
          </H2>
        </View>
      )}

      <Button
        icon={<Icon name="MapPointWave" />}
        label="Locations"
        onPress={() => router.push(`/locations`)}
      />

      <Button
        icon={<Icon name="UsersGroupRounded" />}
        label="Employees"
        onPress={() => router.push(`/employees`)}
      />

      <Button
        icon={<Icon name="SmileCircle" />}
        label="Employees"
        onPress={() => router.push(`/clients`)}
      />
    </TabsPageView>
  );
};
