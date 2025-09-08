import { ContextMenuItem, ContextMenuPopover, Icon, useStackScreenHeaderOptions } from '@symbiot-core-apps/ui';
import { router, Stack, useGlobalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { useCurrentBrandEmployee } from '@symbiot-core-apps/state';

const UpdateLocationHeaderRight = () => {
  const { t } = useTranslation();
  const { id } = useGlobalSearchParams<{ id: string }>();
  const { hasPermission } = useCurrentBrandEmployee();

  const contextMenuItems: ContextMenuItem[] = useMemo(
    () =>
      hasPermission('locationsAll')
        ? [
          {
            label: t('brand.locations.update.context_menu.remove.label'),
            icon: <Icon name="TrashBinMinimalistic" />,
            color: '$error',
            onPress: () => router.push(`/brand/location/remove/${id}`)
          }
        ]
        : [],
    [t, id, hasPermission]
  );

  return <ContextMenuPopover items={contextMenuItems} />;
};

export default () => {
  const { t } = useTranslation();
  const screenOptions = useStackScreenHeaderOptions();

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen
        name="create/index"
        options={{
          gestureEnabled: false
        }}
      />
      <Stack.Screen name="remove/[id]" />
      <Stack.Screen
        name="update/[id]"
        options={{
          headerTitle: t('brand.locations.update.title'),
          headerRight: UpdateLocationHeaderRight
        }}
      />
    </Stack>
  );
};
