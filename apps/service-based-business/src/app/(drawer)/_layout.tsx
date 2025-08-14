import { Redirect } from 'expo-router';
import { NotificationsProvider } from '@symbiot-core-apps/notification';
import {
  StateProvider,
  useCurrentAccount,
  useCurrentBrandState,
} from '@symbiot-core-apps/state';
import {
  useAccountMeQuery,
  useAuthTokens,
  useCurrentBrandQuery,
} from '@symbiot-core-apps/api';
import { onPressNotification } from '../../utils/notification';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { DrawerMenu, drawerMenuMaxWidth } from '../../components/drawer/menu';
import { useInitializing } from '../../hooks/use-initializing';
import { NavigationBackground, useDrawer } from '@symbiot-core-apps/ui';
import { hideAsync } from 'expo-splash-screen';

export default () => {
  const { tokens, setTokens } = useAuthTokens();
  const { setBrand: setCurrentBrand, setBrands: setCurrentBrands } =
    useCurrentBrandState();
  const initializing = useInitializing();
  const { updateMe, updateMePreferences } = useCurrentAccount();
  const { data: meResponse } = useAccountMeQuery({
    enabled: !!tokens.access,
  });
  const { data: currentBrandResponse } = useCurrentBrandQuery({
    enabled: !!tokens.access,
  });
  const {
    headerShown,
    visible: drawerVisible,
    type: drawerType,
    permanent: drawerPermanent,
  } = useDrawer();

  useEffect(() => {
    if (meResponse) {
      updateMe(meResponse);

      if (meResponse.preferences) {
        void updateMePreferences(meResponse.preferences);
      }
    }
  }, [meResponse, updateMe, updateMePreferences]);

  useEffect(() => {
    if (currentBrandResponse) {
      setCurrentBrand(currentBrandResponse.brand);

      if (currentBrandResponse.brands) {
        setCurrentBrands(currentBrandResponse.brands);
      }

      if (currentBrandResponse.tokens) {
        setTokens(currentBrandResponse.tokens);
      }
    }
  }, [currentBrandResponse, setCurrentBrand, setCurrentBrands, setTokens]);

  useEffect(() => {
    if (!initializing) {
      void hideAsync();
    }
  }, [initializing]);

  if (!tokens.access) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <StateProvider>
      <NotificationsProvider
        soundSource={require('../../../assets/audio/new_notification_sound.wav')}
        onPressNotification={onPressNotification}
      >
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Drawer
            drawerContent={DrawerMenu}
            screenOptions={{
              drawerType,
              headerShadowVisible: false,
              swipeEnabled: false,
              headerShown,
              drawerStyle: {
                width: drawerPermanent ? 'auto' : drawerMenuMaxWidth,
                overflow: 'hidden',
                display: !drawerVisible || initializing ? 'none' : undefined,
                borderRightWidth: 0,
              },
              headerBackground: () => <NavigationBackground />,
            }}
          >
            <Drawer.Protected guard={!initializing}>
              <Drawer.Screen
                name="(tabs)"
                options={{
                  headerTitle: '',
                }}
              />
            </Drawer.Protected>

            <Drawer.Protected guard={initializing}>
              <Drawer.Screen
                name="initializing/index"
                options={{ headerShown: false }}
              />
            </Drawer.Protected>
          </Drawer>
        </GestureHandlerRootView>
      </NotificationsProvider>
    </StateProvider>
  );
};
