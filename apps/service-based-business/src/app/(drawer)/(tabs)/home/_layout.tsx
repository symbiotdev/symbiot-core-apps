import { router, Stack } from 'expo-router';
import {
  H3,
  HeaderButton,
  headerButtonSize,
  useStackScreenHeaderOptions,
} from '@symbiot-core-apps/ui';
import { useT } from '@symbiot-core-apps/i18n';
import { useCurrentAccount } from '@symbiot-core-apps/state';
import { Icons } from '../../../../icons/config';

const IndexHeaderLeft = () => {
  const { t } = useT();
  const { me } = useCurrentAccount();

  return (
    me && (
      <H3 lineHeight={headerButtonSize} numberOfLines={1}>
        {t('greeting_firstname', {
          firstname: me.firstname,
        })}
      </H3>
    )
  );
};

const IndexHeaderRight = () => {
  const { stats } = useCurrentAccount();

  return (
    <HeaderButton
      attention={!!stats.newNotifications}
      iconName={Icons.Notifications}
      onPress={() => router.navigate('/home/notifications')}
    />
  );
};

export default () => {
  const { t } = useT();
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
          headerTitle: t('notifications.title'),
        }}
      />
    </Stack>
  );
};
