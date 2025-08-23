import { router, Stack } from 'expo-router';
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
import { useTranslation } from 'react-i18next';

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
        onPress: () => router.push('app/preferences/account/remove'),
      },
    ],
    [t],
  );

  return <ContextMenuPopover items={contextMenuItems} />;
};

export default () => {
  const { t } = useTranslation();
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
        name="(stack)/help-feedback/index"
        options={{
          headerTitle: t('shared.faq.title'),
          animation: nestedScreenAnimation,
        }}
      />
      <Stack.Screen
        name="(stack)/terms-privacy/index"
        options={{
          headerTitle: t('shared.docs.terms_privacy'),
          animation: nestedScreenAnimation,
        }}
      />
      <Stack.Screen
        name="(stack)/follow-us/index"
        options={{
          headerTitle: t('shared.follow_us'),
          animation: nestedScreenAnimation,
        }}
      />
      <Stack.Screen
        name="(stack)/preferences/account/index"
        options={{
          headerTitle: t('shared.profile'),
          headerRight: AccountPreferencesHeaderRight,
        }}
      />
      <Stack.Screen name="preferences/account/remove" />
      <Stack.Screen
        name="(stack)/preferences/appearance/index"
        options={{
          headerTitle: t('shared.preferences.appearance.title'),
        }}
      />
      <Stack.Screen
        name="(stack)/preferences/calendar/index"
        options={{
          headerTitle: t('shared.preferences.calendar.title'),
        }}
      />
      <Stack.Screen
        name="(stack)/preferences/language/index"
        options={{
          headerTitle: t('shared.preferences.language.title'),
        }}
      />
      <Stack.Screen
        name="(stack)/preferences/notifications/index"
        options={{
          headerTitle: t('shared.preferences.notifications.title'),
        }}
      />
    </Stack>
  );
};
