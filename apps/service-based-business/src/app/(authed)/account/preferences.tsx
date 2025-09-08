import { AccountPreferences } from '@symbiot-core-apps/account';
import { router, useNavigation } from 'expo-router';
import React, { useCallback, useLayoutEffect, useMemo } from 'react';
import {
  ContextMenuItem,
  ContextMenuPopover,
  Icon,
} from '@symbiot-core-apps/ui';
import { useTranslation } from 'react-i18next';

export default () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const contextMenuItems: ContextMenuItem[] = useMemo(
    () => [
      {
        label: t(
          'shared.preferences.account.context_menu.remove_account.label',
        ),
        icon: <Icon name="TrashBinMinimalistic" />,
        color: '$error',
        onPress: () => router.push('/account/remove'),
      },
    ],
    [t],
  );

  const headerRight = useCallback(
    () => <ContextMenuPopover items={contextMenuItems} />,
    [],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight,
    });
  }, [headerRight, navigation]);

  return <AccountPreferences />;
};
