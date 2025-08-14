import { router, Stack } from 'expo-router';
import {
  headerBackButtonIconName,
  HeaderButton,
  useDrawer,
  useStackScreenHeaderOptions,
} from '@symbiot-core-apps/ui';
import { useT } from '@symbiot-core-apps/i18n';

const AllNotificationsHeaderLeft = () => (
  <HeaderButton iconName={headerBackButtonIconName} onPress={router.back} />
);

export default () => {
  const { t } = useT();
  const { visible: drawerVisible } = useDrawer();
  const screenOptions = useStackScreenHeaderOptions();

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="(stack)/all/index"
        options={{
          headerTitle: t('notifications.title'),
          ...(!drawerVisible && {
            headerLeft: AllNotificationsHeaderLeft,
          }),
        }}
      />
    </Stack>
  );
};
