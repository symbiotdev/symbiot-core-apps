import { Redirect } from 'expo-router';
import { NotificationsProvider } from '@symbiot-core-apps/notification';
import { StateProvider } from '@symbiot-core-apps/state';
import { useAuthTokens } from '@symbiot-core-apps/api';
import { onPressNotification } from '../../utils/notification';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { DrawerMenu, drawerMenuMaxWidth } from '../../components/drawer/menu';
import { NavigationBackground, useDrawer } from '@symbiot-core-apps/ui';
import { hideAsync } from 'expo-splash-screen';
import { useCurrentEntitiesLoader } from '../../hooks/use-current-entities-loader';

export default () => {
  const { tokens } = useAuthTokens();
  const {
    headerShown,
    visible: drawerVisible,
    type: drawerType,
    permanent: drawerPermanent,
  } = useDrawer();
  const currentEntitiesLoaded = useCurrentEntitiesLoader();

  useEffect(() => {
    if (!currentEntitiesLoaded) {
      void hideAsync();
    }
  }, [currentEntitiesLoaded]);

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
                display:
                  !drawerVisible || currentEntitiesLoaded ? 'none' : undefined,
                borderRightWidth: 0,
              },
              headerBackground: () => <NavigationBackground />,
            }}
          >
            <Drawer.Protected guard={currentEntitiesLoaded}>
              <Drawer.Screen
                name="(tabs)"
                options={{
                  headerTitle: '',
                }}
              />
            </Drawer.Protected>

            <Drawer.Protected guard={!currentEntitiesLoaded}>
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
