import { router, Stack } from 'expo-router';
import {
  H3,
  HeaderButton,
  headerButtonSize,
  useStackScreenHeaderOptions,
} from '@symbiot-core-apps/ui';
import { useCurrentAccount } from '@symbiot-core-apps/state';
import { useApp } from '@symbiot-core-apps/app';
import { useTranslation } from 'react-i18next';

const IndexHeaderLeft = () => {
  const { t } = useTranslation();
  const { me } = useCurrentAccount();

  return (
    me && (
      <H3 lineHeight={headerButtonSize} numberOfLines={1}>
        {t('shared.greeting_firstname', {
          firstname: me.firstname,
        })}
      </H3>
    )
  );
};

const IndexHeaderRight = () => {
  const { icons } = useApp();
  const { stats } = useCurrentAccount();

  return (
    <HeaderButton
      attention={!!stats.newNotifications}
      iconName={icons.Notifications}
      onPress={() => router.navigate('/home/notifications')}
    />
  );
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
        name="(stack)/notifications/index"
        options={{
          headerTitle: t('shared.notifications.title'),
        }}
      />
    </Stack>
  );
};
