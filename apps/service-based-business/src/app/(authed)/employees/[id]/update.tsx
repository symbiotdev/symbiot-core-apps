import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useBrandEmployeeDetailedByIdQuery } from '@symbiot-core-apps/api';
import {
  ContextMenuItem,
  ContextMenuPopover,
  Icon,
  InitView,
} from '@symbiot-core-apps/ui';
import { UpdateBrandEmployee } from '@symbiot-core-apps/brand-employee';
import { useCallback, useLayoutEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useCurrentBrandEmployee,
  useCurrentBrandState,
} from '@symbiot-core-apps/state';

export default () => {
  const { brand } = useCurrentBrandState();
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const { currentEmployee } = useCurrentBrandEmployee();
  const {
    data: employee,
    error,
    isPending,
  } = useBrandEmployeeDetailedByIdQuery(id);

  const contextMenuItems: ContextMenuItem[] = useMemo(
    () => [
      ...(brand?.owner?.id !== id && currentEmployee?.id !== id
        ? [
            {
              label: t('brand_employee.update.context_menu.remove.label'),
              icon: <Icon name="TrashBinMinimalistic" />,
              color: '$error',
              onPress: () => router.push(`/employees/${id}/remove`),
            } as ContextMenuItem,
          ]
        : []),
    ],
    [brand?.owner?.id, id, currentEmployee?.id, t],
  );

  const headerRight = useCallback(
    () => <ContextMenuPopover items={contextMenuItems} />,
    [contextMenuItems],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight,
    });
  }, [headerRight, navigation]);

  if (!employee || error) {
    return <InitView loading={isPending} error={error} />;
  }

  return <UpdateBrandEmployee employee={employee} />;
};
