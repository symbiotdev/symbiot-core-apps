import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useBrandEmployeeDetailedByIdReq } from '@symbiot-core-apps/api';
import { InitView } from '@symbiot-core-apps/ui';
import { UpdateBrandEmployee } from '@symbiot-core-apps/brand-employee';
import { useCallback, useLayoutEffect, useMemo } from 'react';
import {
  useCurrentBrandEmployee,
  useCurrentBrandState,
} from '@symbiot-core-apps/state';
import { useI18n } from '@symbiot-core-apps/shared';
import { ContextMenu, ContextMenuItem, Icon } from '@symbiot-core-apps/ui2';

export default () => {
  const { brand } = useCurrentBrandState();
  const { t } = useI18n();
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const { currentEmployee } = useCurrentBrandEmployee();
  const {
    data: employee,
    error,
    isPending,
  } = useBrandEmployeeDetailedByIdReq(id);

  const contextMenuItems: ContextMenuItem[] = useMemo(
    () => [
      ...(brand?.owner?.id !== id && currentEmployee?.id !== id
        ? [
            {
              label: t('brand_employee.update.context_menu.remove.label'),
              icon: <Icon name="TrashBinMinimalistic" />,
              // fixme colorize
              color: 'red',
              onPress: () => router.push(`/employees/${id}/remove`),
            } as ContextMenuItem,
          ]
        : []),
    ],
    [brand?.owner?.id, id, currentEmployee?.id, t],
  );

  const headerRight = useCallback(
    () =>
      contextMenuItems.length ? (
        <ContextMenu items={contextMenuItems} />
      ) : undefined,
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
