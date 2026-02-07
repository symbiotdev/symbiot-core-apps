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
import { ConfirmAlert, useI18n } from '@symbiot-core-apps/shared';
import { useAccountAuthSignOutReq } from '@symbiot-core-apps/api';

export default () => {
  const { t } = useI18n();
  const { currentEmployee, hasPermission } = useCurrentBrandEmployee();
  const navigation = useNavigation();
  const { mutate: signOut } = useAccountAuthSignOutReq();

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
              label: t('shared.auth.sign_out.button.label'),
              icon: <Icon name="Logout" />,
              onPress: () =>
                ConfirmAlert({
                  title: t('shared.auth.sign_out.confirm.title'),
                  onAgree: signOut,
                }),
            },
          ],
    [currentEmployee?.id, hasPermission, signOut, t],
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
