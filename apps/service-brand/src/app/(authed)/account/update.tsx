import { UpdateAccount } from '@symbiot-core-apps/account';
import { router, useNavigation } from 'expo-router';
import React, { useCallback, useLayoutEffect, useMemo } from 'react';
import {
  ContextMenuItem,
  ContextMenuPopover,
  Icon,
} from '@symbiot-core-apps/ui';
import { useI18n } from '@symbiot-core-apps/shared';

export default () => {
  const { t } = useI18n();
  const navigation = useNavigation();

  const contextMenuItems: ContextMenuItem[] = useMemo(
    () => [
      {
        label: t('shared.account.update.context_menu.remove_account.label'),
        icon: <Icon name="TrashBinMinimalistic" />,
        color: '$error',
        onPress: () => router.push('/account/remove'),
      },
    ],
    [t],
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
