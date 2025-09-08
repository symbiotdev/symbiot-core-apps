import {
  H3,
  HeaderButton,
  headerButtonSize,
  useDrawer,
  useStackScreenHeaderOptions,
} from '@symbiot-core-apps/ui';
import { router, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useCurrentAccount } from '@symbiot-core-apps/state';
import { useApp } from '@symbiot-core-apps/app';

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
  const { visible } = useDrawer();
  const { stats } = useCurrentAccount();

  return (
    <HeaderButton
      attention={!!stats.newNotifications}
      iconName={icons.Notifications}
      onPress={() =>
        visible
          ? router.replace('/notifications')
          : router.push('/notifications')
      }
    />
  );
};

export default () => {
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
    </Stack>
  );
};
