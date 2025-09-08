import {
  ContextMenuItem,
  ContextMenuPopover,
  HeaderButton,
  Icon,
  useStackScreenHeaderOptions,
} from '@symbiot-core-apps/ui';
import { router, Stack, useGlobalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import {
  useCurrentBrandEmployee,
  useCurrentBrandState,
} from '@symbiot-core-apps/state';
import { useMemo } from 'react';

const IndexHeaderRight = () => {
  const { hasPermission } = useCurrentBrandEmployee();

  return (
    hasPermission('employeesAll') && (
      <HeaderButton
        iconName="AddCircle"
        onPress={() => router.push('/employees/create')}
      />
    )
  );
};

const UpdateEmployeeHeaderRight = () => {
  const { t } = useTranslation();
  const { id } = useGlobalSearchParams<{ id: string }>();
  const { brand } = useCurrentBrandState();
  const { currentEmployee, hasPermission } = useCurrentBrandEmployee();

  const contextMenuItems: ContextMenuItem[] = useMemo(
    () => [
      ...(brand?.owner?.id !== id &&
      currentEmployee?.id !== id &&
      hasPermission('employeesAll')
        ? [
            {
              label: t('brand.employees.update.context_menu.remove.label'),
              icon: <Icon name="TrashBinMinimalistic" />,
              color: '$error',
              onPress: () => router.push(`/employees/remove/${id}`),
            } as ContextMenuItem,
          ]
        : []),
    ],
    [brand?.owner?.id, id, currentEmployee?.id, hasPermission, t],
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
          headerTitle: t('brand.employees.title'),
          headerRight: IndexHeaderRight,
        }}
      />
      <Stack.Screen name="create/index" />
      <Stack.Screen name="remove/[id]" />
      <Stack.Screen
        name="update/[id]"
        options={{
          headerTitle: t('brand.employees.update.title'),
          headerRight: UpdateEmployeeHeaderRight,
        }}
      />
    </Stack>
  );
};
