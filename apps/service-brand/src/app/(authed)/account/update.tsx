import { UpdateAccount } from '@symbiot-core-apps/account';
import { useNavigation } from 'expo-router';
import React, { useLayoutEffect, useMemo } from 'react';
import { ConfirmAlert, useI18n } from '@symbiot-core-apps/shared';
import { useAccountAuthSignOutReq } from '@symbiot-core-apps/api';
import { ContextMenu, ContextMenuItem, Icon } from '@symbiot-core-apps/ui2';

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

  useLayoutEffect(() => {
    navigation.setOptions({
      ...(contextMenuItems.length && {
        headerRight: <ContextMenu items={contextMenuItems} />,
      }),
    });
  }, [contextMenuItems, navigation]);

  return <UpdateAccount />;
};
