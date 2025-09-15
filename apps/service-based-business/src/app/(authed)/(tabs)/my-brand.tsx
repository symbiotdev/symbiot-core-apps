import {
  Avatar,
  Button,
  H2,
  H3,
  HeaderButton,
  headerButtonSize,
  Icon,
  TabsPageView,
  useDrawer,
} from '@symbiot-core-apps/ui';
import { View, XStack } from 'tamagui';
import {
  useCurrentBrandEmployee,
  useCurrentBrandState,
} from '@symbiot-core-apps/state';
import { router, useNavigation } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import { useApp } from '@symbiot-core-apps/app';
import { useTranslation } from 'react-i18next';

export default () => {
  const { brand: currentBrand } = useCurrentBrandState();
  const { icons } = useApp();
  const {t} = useTranslation();
  const { visible: drawerVisible } = useDrawer();
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
          {!drawerVisible && hasPermission('analyticsAll') && (
            <HeaderButton
              iconName="ChartSquare"
              onPress={() => router.push(`/analytics`)}
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
  }, [
    currentBrand?.name,
    drawerVisible,
    hasAnyPermission,
    hasPermission,
    navigation,
  ]);

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
        type="clear"
        icon={<Icon name="MapPointWave" />}
        label={t('brand.locations.title')}
        onPress={() => router.push(`/locations`)}
      />

      <Button
        type="clear"
        icon={<Icon name="UsersGroupRounded" />}
        label={t('brand.employees.title')}
        onPress={() => router.push(`/employees`)}
      />

      <Button
        type="clear"
        icon={<Icon name="SmileCircle" />}
        label={t('brand.clients.title')}
        onPress={() => router.push(`/clients`)}
      />

      <Button
        type="clear"
        icon={<Icon name={icons.Service} />}
        label={t('brand.services.title')}
        onPress={() => router.push(`/services`)}
      />
    </TabsPageView>
  );
};
