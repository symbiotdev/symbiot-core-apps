import {
  ContextMenuItem,
  ContextMenuPopover,
  HeaderButton,
  Icon,
  RegularText,
  useStackScreenHeaderOptions,
} from '@symbiot-core-apps/ui';
import { router, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import React, { useCallback, useMemo } from 'react';
import { Platform } from 'react-native';
import { XStack } from 'tamagui';
import { ConfirmAlert, DeviceVersion } from '@symbiot-core-apps/shared';
import { useAccountAuthSignOutQuery } from '@symbiot-core-apps/api';

const IndexHeaderLeft = () => {
  const { t } = useTranslation();

  return (
    Platform.OS !== 'web' && (
      <XStack gap="$2" alignItems="center">
        <Icon name="Code" color="$placeholderColor" />
        <RegularText color="$placeholderColor">
          {t('shared.version')}: {DeviceVersion}
        </RegularText>
      </XStack>
    )
  );
};

const IndexHeaderRight = () => {
  const { t } = useTranslation();
  const { mutate: signOut } = useAccountAuthSignOutQuery();

  const onSignOutPress = useCallback(
    () =>
      ConfirmAlert({
        title: t('shared.auth.sign_out.confirm.title'),
        callback: signOut,
      }),
    [signOut, t],
  );

  return <HeaderButton iconName="Logout2" onPress={onSignOutPress} />;
};

const AccountPreferencesHeaderRight = () => {
  const { t } = useTranslation();

  const contextMenuItems: ContextMenuItem[] = useMemo(
    () => [
      {
        label: t(
          'shared.preferences.account.context_menu.remove_account.label',
        ),
        icon: <Icon name="TrashBinMinimalistic" />,
        color: '$error',
        onPress: () => router.push('/preferences/account/remove'),
      },
    ],
    [t],
  );

  return <ContextMenuPopover items={contextMenuItems} />;
};

export default () => {
  const { t } = useTranslation();
  const screenOptions = useStackScreenHeaderOptions();

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen
        name="index"
        options={{
          headerLeft: IndexHeaderLeft,
          headerRight: IndexHeaderRight,
        }}
      />
      <Stack.Screen
        name="(stack)/account/index"
        options={{
          headerTitle: t('shared.profile'),
          headerRight: AccountPreferencesHeaderRight,
        }}
      />
      <Stack.Screen name="(stack)/account/remove" />
      <Stack.Screen
        name="(stack)/appearance/index"
        options={{
          headerTitle: t('shared.preferences.appearance.title'),
        }}
      />
      <Stack.Screen
        name="(stack)/calendar/index"
        options={{
          headerTitle: t('shared.preferences.calendar.title'),
        }}
      />
      <Stack.Screen
        name="(stack)/language/index"
        options={{
          headerTitle: t('shared.preferences.language.title'),
        }}
      />
      <Stack.Screen
        name="(stack)/notifications/index"
        options={{
          headerTitle: t('shared.preferences.notifications.title'),
        }}
      />
    </Stack>
  );
};
