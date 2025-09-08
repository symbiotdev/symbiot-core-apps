import {
  ContextMenuItem,
  ContextMenuPopover,
  HeaderButton,
  Icon,
  useStackScreenHeaderOptions,
} from '@symbiot-core-apps/ui';
import { router, Stack, useGlobalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useCurrentBrandEmployee } from '@symbiot-core-apps/state';
import { useMemo } from 'react';

const IndexHeaderRight = () => {
  const { hasPermission } = useCurrentBrandEmployee();

  return (
    hasPermission('locationsAll') && (
      <HeaderButton
        iconName="AddCircle"
        onPress={() => router.push('/locations/create')}
      />
    )
  );
};

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
              onPress: () => router.push(`/locations/remove/${id}`),
            },
          ]
        : [],
    [t, id, hasPermission],
  );

  return <ContextMenuPopover items={contextMenuItems} />;
};

export default () => {
  const { t } = useTranslation();
  const screenOptions = useStackScreenHeaderOptions();

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: t('brand.locations.title'),
          headerRight: IndexHeaderRight,
        }}
      />
      <Stack.Screen name="create/index" />
      <Stack.Screen name="remove/[id]" />
      <Stack.Screen
        name="update/[id]"
        options={{
          headerTitle: t('brand.locations.update.title'),
          headerRight: UpdateLocationHeaderRight,
        }}
      />
    </Stack>
  );
};
