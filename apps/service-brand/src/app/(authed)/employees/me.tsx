import { useCurrentBrandEmployee } from '@symbiot-core-apps/state';
import { BrandEmployeeProfile } from '@symbiot-core-apps/brand-employee';
import React, { useCallback, useLayoutEffect, useMemo } from 'react';
import {
  ContextMenuItem,
  ContextMenuPopover,
  Icon,
  InitView,
} from '@symbiot-core-apps/ui';
import { router, useNavigation } from 'expo-router';
import { useI18n } from '@symbiot-core-apps/shared';

export default () => {
  const { t } = useI18n();
  const { currentEmployee, hasPermission } = useCurrentBrandEmployee();
  const navigation = useNavigation();

  const contextMenuItems: ContextMenuItem[] = useMemo(
    () =>
      !currentEmployee?.id
        ? []
        : [
            ...(hasPermission('employees')
              ? [
                  {
                    label: t('shared.settings'),
                    icon: <Icon name="SettingsMinimalistic" />,
                    onPress: () =>
                      router.push(`/employees/${currentEmployee.id}/update`),
                  },
                ]
              : []),
            {
              label: t(
                'shared.account.update.context_menu.remove_account.label',
              ),
              icon: <Icon name="TrashBinMinimalistic" />,
              color: '$error',
              onPress: () => router.push('/account/remove'),
            },
          ],
    [currentEmployee?.id, hasPermission, t],
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

  if (!currentEmployee) {
    return <InitView loading />;
  }

  return <BrandEmployeeProfile employee={currentEmployee} />;
};
