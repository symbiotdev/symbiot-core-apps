import { useT } from '@symbiot-core-apps/i18n';
import {
  H3,
  HeaderButton,
  headerButtonSize,
  useDrawer,
  useStackScreenHeaderOptions,
} from '@symbiot-core-apps/ui';
import { router, Stack } from 'expo-router';
import {
  useCurrentAccount,
  useCurrentBrandState,
} from '@symbiot-core-apps/state';
import { Icons } from '../../../../icons/config';

const IndexHeaderLeft = () => {
  const { brand } = useCurrentBrandState();

  return (
    brand && (
      <H3 lineHeight={headerButtonSize} numberOfLines={1}>
        {brand.name}
      </H3>
    )
  );
};

const IndexHeaderRight = () => {
  return (
    <HeaderButton
      iconName="SettingsMinimalistic"
      onPress={() => alert('Configure brand')}
    />
  );
};

const InitialActionHeaderLeft = () => {
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

const InitialActionHeaderRight = () => {
  const { stats } = useCurrentAccount();

  return (
    <HeaderButton
      attention={!!stats.newNotifications}
      iconName={Icons.Notifications}
      onPress={() => router.navigate('/notifications/all')}
    />
  );
};

export default () => {
  const { brand: currentBrand, brands: currentBrands } = useCurrentBrandState();
  const { visible: drawerVisible } = useDrawer();
  const screenOptions = useStackScreenHeaderOptions();

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Protected guard={!currentBrand}>
        <Stack.Screen
          name="initial-action"
          options={{
            headerLeft: !drawerVisible ? InitialActionHeaderLeft : undefined,
            headerRight: !drawerVisible ? InitialActionHeaderRight : undefined,
          }}
        />

        <Stack.Protected guard={!!currentBrands && !currentBrands.length}>
          <Stack.Screen
            name="(stack)/create/index"
            options={{
              gestureEnabled: false,
            }}
          />
        </Stack.Protected>
      </Stack.Protected>

      <Stack.Protected guard={!!currentBrand}>
        <Stack.Screen
          name="index"
          options={{
            headerLeft: IndexHeaderLeft,
            headerRight: IndexHeaderRight,
          }}
        />

        <Stack.Screen
          name="(stack)/location/create/index"
          options={{
            gestureEnabled: false,
          }}
        />
      </Stack.Protected>
    </Stack>
  );
};
