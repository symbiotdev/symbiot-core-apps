import { router, Stack } from 'expo-router';
import { useT } from '@symbiot-core-apps/i18n';
import { Platform } from 'react-native';
import { XStack } from 'tamagui';
import {
  ContextMenuItem,
  ContextMenuPopover,
  HeaderButton,
  Icon,
  RegularText,
  useDrawer,
  useStackScreenHeaderOptions,
} from '@symbiot-core-apps/ui';
import { ConfirmAlert, DeviceVersion } from '@symbiot-core-apps/shared';
import { useAccountAuthSignOutQuery } from '@symbiot-core-apps/api';
import { useCallback, useMemo } from 'react';

const IndexHeaderLeft = () => {
  const { t } = useT();

  return (
    Platform.OS !== 'web' && (
      <XStack gap="$2" alignItems="center">
        <Icon name="Code" color="$placeholderColor" />
        <RegularText color="$placeholderColor">
          {t('version')}: {DeviceVersion}
        </RegularText>
      </XStack>
    )
  );
};

const IndexHeaderRight = () => {
  const { t } = useT();
  const { mutate: signOut } = useAccountAuthSignOutQuery();

  const onSignOutPress = useCallback(
    () =>
      ConfirmAlert({
        title: t('auth.sign_out.confirm.title'),
        callback: signOut,
      }),
    [signOut, t],
  );

  return <HeaderButton iconName="Logout2" onPress={onSignOutPress} />;
};

const AccountPreferencesHeaderRight = () => {
  const { t } = useT();

  const contextMenuItems: ContextMenuItem[] = useMemo(
    () => [
      {
        label: t('preferences.account.context_menu.remove_account.label'),
        icon: <Icon name="TrashBinMinimalistic" />,
        color: '$error',
        onPress: () => router.push('app/preferences/account/remove'),
      },
    ],
    [t],
  );

  return <ContextMenuPopover items={contextMenuItems} />;
};

export default () => {
  const { t } = useT();
  const screenOptions = useStackScreenHeaderOptions();
  const { visible: drawerVisible } = useDrawer();

  const nestedScreenAnimation = useMemo(
    () => (drawerVisible ? 'none' : screenOptions.animation),
    [drawerVisible, screenOptions.animation],
  );

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen
        name="index"
        options={{
          headerLeft: IndexHeaderLeft,
          headerRight: IndexHeaderRight,
          animation: nestedScreenAnimation,
        }}
      />
      <Stack.Screen
        name="help-feedback/index"
        options={{
          headerTitle: t('faq.title'),
          animation: nestedScreenAnimation,
        }}
      />
      <Stack.Screen
        name="terms-privacy/index"
        options={{
          headerTitle: t('docs.terms_privacy'),
          animation: nestedScreenAnimation,
        }}
      />
      <Stack.Screen
        name="follow-us/index"
        options={{
          headerTitle: t('follow_us'),
          animation: nestedScreenAnimation,
        }}
      />
      <Stack.Screen
        name="notifications/index"
        options={{
          headerTitle: t('notifications.title'),
          animation: nestedScreenAnimation,
        }}
      />
      <Stack.Screen
        name="preferences/account/index"
        options={{
          headerTitle: t('profile'),
          headerRight: AccountPreferencesHeaderRight,
        }}
      />
      <Stack.Screen name="preferences/account/remove" />
      <Stack.Screen
        name="preferences/appearance/index"
        options={{
          headerTitle: t('preferences.appearance.title'),
        }}
      />
      <Stack.Screen
        name="preferences/calendar/index"
        options={{
          headerTitle: t('preferences.calendar.title'),
        }}
      />
      <Stack.Screen
        name="preferences/language/index"
        options={{
          headerTitle: t('preferences.language.title'),
        }}
      />
      <Stack.Screen
        name="preferences/notifications/index"
        options={{
          headerTitle: t('preferences.notifications.title'),
        }}
      />
    </Stack>
  );
};
