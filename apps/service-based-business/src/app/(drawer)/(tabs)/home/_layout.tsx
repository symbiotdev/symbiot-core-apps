import { router, Stack } from 'expo-router';
import {
  H3,
  HeaderButton,
  headerButtonSize,
  useDrawer,
  useStackScreenHeaderOptions,
} from '@symbiot-core-apps/ui';
import { useT } from '@symbiot-core-apps/i18n';
import { useCurrentAccount } from '@symbiot-core-apps/state';
import { Icons } from '../../../../icons/config';

const IndexHeaderLeft = () => {
  const { t } = useT();
  const { me } = useCurrentAccount();

  return me && me.firstname !== 'Account' ? (
    <H3 lineHeight={headerButtonSize} numberOfLines={1}>
      {t('greeting_firstname', {
        firstname: me.firstname,
      })}
    </H3>
  ) : undefined;
};

const IndexHeaderRight = () => {
  const { stats } = useCurrentAccount();

  return (
    <HeaderButton
      attention={!!stats.newNotifications}
      iconName={Icons.Notifications}
      onPress={() => router.navigate('/app/notifications')}
    />
  );
};

export default () => {
  const { visible: drawerVisible } = useDrawer();
  const screenOptions = useStackScreenHeaderOptions();

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen
        name="index"
        options={{
          headerLeft: !drawerVisible ? IndexHeaderLeft : undefined,
          headerRight: !drawerVisible ? IndexHeaderRight : undefined,
        }}
      />
    </Stack>
  );
};
