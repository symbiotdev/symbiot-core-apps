import { UpdateAccount } from '@symbiot-core-apps/account';
import { useNavigation } from 'expo-router';
import React, { useCallback, useLayoutEffect, useMemo } from 'react';
import {
  ContextMenuItem,
  ContextMenuPopover,
  Icon,
} from '@symbiot-core-apps/ui';
import { ConfirmAlert, useI18n } from '@symbiot-core-apps/shared';
import { useAccountAuthSignOutReq } from '@symbiot-core-apps/api';

export default () => {
  const { t } = useI18n();
  const navigation = useNavigation();
  const { mutate: signOut } = useAccountAuthSignOutReq();

  const contextMenuItems: ContextMenuItem[] = useMemo(
    () => [
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
    [signOut, t],
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

  return <UpdateAccount />;
};
