import {
  LoadingView,
  useDrawer,
  useStackScreenHeaderOptions,
} from '@symbiot-core-apps/ui';
import { Redirect, Stack } from 'expo-router';
import { useAuthTokens } from '@symbiot-core-apps/api';
import { useCurrentEntitiesLoader } from '../../hooks/use-current-entities-loader';
import { useEffect } from 'react';
import { hideAsync } from 'expo-splash-screen';
import { XStack } from 'tamagui';
import { DrawerMenu } from '../../components/drawer/menu';
import { StateProvider } from '../../providers/state.provider';
import { SocketProvider } from '../../providers/socket.provider';
import { NotificationsProvider } from '@symbiot-core-apps/notification';
import { onPressNotification } from '../../utils/notification';
import { useCurrentBrandEmployee } from '@symbiot-core-apps/state';

export default () => {
  const { tokens } = useAuthTokens();
  const { visible: drawerVisible } = useDrawer();
  const currentEntitiesLoaded = useCurrentEntitiesLoader();
  const screenOptions = useStackScreenHeaderOptions();
  const { hasPermission } = useCurrentBrandEmployee();

  useEffect(() => {
    if (currentEntitiesLoaded) {
      void hideAsync();
    }
  }, [currentEntitiesLoaded]);

  if (!tokens.access) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <StateProvider>
      <SocketProvider>
        <NotificationsProvider onPressNotification={onPressNotification}>
          <XStack flex={1}>
            {drawerVisible && <DrawerMenu />}

            {!currentEntitiesLoaded ? (
              <LoadingView />
            ) : (
              <Stack
                screenOptions={{
                  ...screenOptions,
                  headerShown: false,
                  ...(drawerVisible && {
                    animation: 'none',
                  }),
                }}
              >
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="brand" />
                <Stack.Screen name="follow-us" />
                <Stack.Screen name="help-feedback" />
                <Stack.Screen name="notifications" />
                <Stack.Screen name="terms-privacy" />

                <Stack.Protected guard={hasPermission('clientsAll')}>
                  <Stack.Screen name="client" />
                  <Stack.Screen name="clients" />
                </Stack.Protected>

                <Stack.Protected guard={hasPermission('employeesAll')}>
                  <Stack.Screen name="employee" />
                  <Stack.Screen name="employees" />
                </Stack.Protected>

                <Stack.Protected guard={hasPermission('locationsAll')}>
                  <Stack.Screen name="location" />
                  <Stack.Screen name="locations" />
                </Stack.Protected>
              </Stack>
            )}
          </XStack>
        </NotificationsProvider>
      </SocketProvider>
    </StateProvider>
  );
};
