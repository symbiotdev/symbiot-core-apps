import {
  ContextMenuItem,
  ContextMenuPopover,
  H3,
  HeaderButton,
  headerButtonSize,
  Icon,
  useDrawer,
  useStackScreenHeaderOptions,
} from '@symbiot-core-apps/ui';
import { router, Stack, useGlobalSearchParams } from 'expo-router';
import {
  useCurrentAccount,
  useCurrentBrandState,
} from '@symbiot-core-apps/state';
import { useApp } from '@symbiot-core-apps/app';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

const IndexHeaderLeft = () => {
  const { brand } = useCurrentBrandState();

  return (
    brand && (
      <H3 lineHeight={headerButtonSize} numberOfLines={1}>
        {brand.name}
      </H3>
    )
  );
};

const IndexHeaderRight = () => {
  return (
    <HeaderButton
      iconName="SettingsMinimalistic"
      onPress={() => router.push('/brand/menu')}
    />
  );
};

const InitialActionHeaderLeft = () => {
  const { t } = useTranslation();
  const { me } = useCurrentAccount();

  return me && me.firstname !== 'Account' ? (
    <H3 lineHeight={headerButtonSize} numberOfLines={1}>
      {t('shared.greeting_firstname', {
        firstname: me.firstname,
      })}
    </H3>
  ) : undefined;
};

const InitialActionHeaderRight = () => {
  const { stats } = useCurrentAccount();
  const { icons } = useApp();

  return (
    <HeaderButton
      attention={!!stats.newNotifications}
      iconName={icons.Notifications}
      onPress={() => router.navigate('/brand/notifications')}
    />
  );
};

const LocationsHeaderRight = () => (
  <HeaderButton
    iconName="AddCircle"
    onPress={() => router.navigate('/brand/location/create')}
  />
);

const EmployeesHeaderRight = () => (
  <HeaderButton
    iconName="AddCircle"
    onPress={() => router.navigate('/brand/employee/create')}
  />
);

const UpdateLocationHeaderRight = () => {
  const { t } = useTranslation();
  const { id } = useGlobalSearchParams<{ id: string }>();

  const contextMenuItems: ContextMenuItem[] = useMemo(
    () => [
      {
        label: t('brand.locations.update.context_menu.remove.label'),
        icon: <Icon name="TrashBinMinimalistic" />,
        color: '$error',
        onPress: () => router.push(`/brand/location/remove/${id}`),
      },
    ],
    [t, id],
  );

  return <ContextMenuPopover items={contextMenuItems} />;
};

const UpdateEmployeeHeaderRight = () => {
  const { t } = useTranslation();
  const { id } = useGlobalSearchParams<{ id: string }>();
  const { brand } = useCurrentBrandState();

  const contextMenuItems: ContextMenuItem[] = useMemo(
    () => [
      ...(brand?.owner?.id !== id
        ? [
            {
              label: t('brand.employees.update.context_menu.remove.label'),
              icon: <Icon name="TrashBinMinimalistic" />,
              color: '$error',
              onPress: () => router.push(`/brand/employee/remove/${id}`),
            } as ContextMenuItem,
          ]
        : []),
    ],
    [t, id, brand?.owner?.id],
  );

  return <ContextMenuPopover items={contextMenuItems} />;
};

export default () => {
  const { brand: currentBrand, brands: currentBrands } = useCurrentBrandState();
  const { t } = useTranslation();
  const { visible: drawerVisible } = useDrawer();
  const screenOptions = useStackScreenHeaderOptions();

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Protected guard={!currentBrand}>
        <Stack.Screen
          name="initial-action"
          options={{
            headerLeft: !drawerVisible ? InitialActionHeaderLeft : undefined,
            headerRight: !drawerVisible ? InitialActionHeaderRight : undefined,
          }}
        />

        <Stack.Protected guard={!!currentBrands && !currentBrands.length}>
          <Stack.Screen
            name="(stack)/create/index"
            options={{
              gestureEnabled: false,
            }}
          />
        </Stack.Protected>
      </Stack.Protected>

      <Stack.Protected guard={!!currentBrand}>
        <Stack.Screen
          name="index"
          options={{
            headerLeft: IndexHeaderLeft,
            headerRight: IndexHeaderRight,
          }}
        />

        <Stack.Screen
          name="(stack)/employee/create/index"
          options={{
            gestureEnabled: false,
          }}
        />
        <Stack.Screen name="(stack)/employee/remove/[id]" />
        <Stack.Screen
          name="(stack)/employee/update/[id]"
          options={{
            headerTitle: t('brand.employees.update.title'),
            headerRight: UpdateEmployeeHeaderRight,
          }}
        />

        <Stack.Screen
          name="(stack)/location/create/index"
          options={{
            gestureEnabled: false,
          }}
        />
        <Stack.Screen name="(stack)/location/remove/[id]" />
        <Stack.Screen
          name="(stack)/location/update/[id]"
          options={{
            headerTitle: t('brand.locations.update.title'),
            headerRight: UpdateLocationHeaderRight,
          }}
        />
      </Stack.Protected>

      <Stack.Screen
        name="(stack)/notifications/index"
        options={{
          headerTitle: t('shared.notifications.title'),
        }}
      />

      <Stack.Screen
        name="(stack)/menu/index"
        options={{
          headerTitle: currentBrand?.name,
        }}
      />

      <Stack.Screen
        name="(stack)/menu/employees/index"
        options={{
          headerTitle: t('brand.employees.title'),
          headerRight: EmployeesHeaderRight,
        }}
      />

      <Stack.Screen
        name="(stack)/menu/locations/index"
        options={{
          headerTitle: t('brand.locations.title'),
          headerRight: LocationsHeaderRight,
        }}
      />

      <Stack.Screen
        name="(stack)/menu/information/preferences"
        options={{
          headerTitle: t('brand.information.title'),
        }}
      />
    </Stack>
  );
};
