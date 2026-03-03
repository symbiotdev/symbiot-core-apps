import { useCurrentBrandEmployee } from '@symbiot-core-apps/state';
import { BrandEmployeeProfile } from '@symbiot-core-apps/brand-employee';
import React, { useLayoutEffect, useMemo } from 'react';
import { router, useNavigation } from 'expo-router';
import { ConfirmAlert, useI18n } from '@symbiot-core-apps/shared';
import { useAccountAuthSignOutReq } from '@symbiot-core-apps/api';
import {
  ContextMenu,
  ContextMenuItem,
  FallbackView,
  Icon,
} from '@symbiot-core-apps/ui2';

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

  useLayoutEffect(() => {
    navigation.setOptions({
      ...(contextMenuItems.length && {
        headerRight: () => <ContextMenu items={contextMenuItems} />,
      }),
    });
  }, [contextMenuItems, navigation]);

  if (!currentEmployee) {
    return <FallbackView loading />;
  }

  return <BrandEmployeeProfile employee={currentEmployee} />;
};
