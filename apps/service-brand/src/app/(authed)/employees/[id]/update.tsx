import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useBrandEmployeeDetailedByIdReq } from '@symbiot-core-apps/api';
import { UpdateBrandEmployee } from '@symbiot-core-apps/brand-employee';
import { useLayoutEffect, useMemo } from 'react';
import {
  useCurrentBrandEmployee,
  useCurrentBrandState,
} from '@symbiot-core-apps/state';
import { useI18n } from '@symbiot-core-apps/shared';
import {
  ContextMenu,
  ContextMenuItem,
  FallbackView,
  Icon,
} from '@symbiot-core-apps/ui2';

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

  useLayoutEffect(() => {
    navigation.setOptions({
      ...(contextMenuItems.length && {
        headerRight: () => <ContextMenu items={contextMenuItems} />,
      }),
    });
  }, [contextMenuItems, navigation]);

  if (!employee || error) {
    return <FallbackView loading={isPending} error={error} />;
  }

  return <UpdateBrandEmployee employee={employee} />;
};
