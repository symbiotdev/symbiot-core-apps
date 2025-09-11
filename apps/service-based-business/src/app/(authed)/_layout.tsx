import {
  HeaderButton,
  LoadingView,
  useDrawer,
  useStackScreenHeaderOptions,
} from '@symbiot-core-apps/ui';
import { Redirect, router, Stack } from 'expo-router';
import { useAuthTokens } from '@symbiot-core-apps/api';
import { useCurrentEntitiesLoader } from '../../hooks/use-current-entities-loader';
import React, { useEffect } from 'react';
import { hideAsync } from 'expo-splash-screen';
import { XStack } from 'tamagui';
import { DrawerMenu } from '../../components/drawer/menu';
import { StateProvider } from '../../providers/state.provider';
import { SocketProvider } from '../../providers/socket.provider';
import { NotificationsProvider } from '@symbiot-core-apps/notification';
import { onPressNotification } from '../../utils/notification';
import {
  useCurrentBrandEmployee,
  useCurrentBrandState,
} from '@symbiot-core-apps/state';
import { useTranslation } from 'react-i18next';

export default () => {
  const { t } = useTranslation();
  const { tokens } = useAuthTokens();
  const { brand: currentBrand, brands: currentBrands } = useCurrentBrandState();
  const { visible: drawerVisible } = useDrawer();
  const currentEntitiesLoaded = useCurrentEntitiesLoader();
  const screenOptions = useStackScreenHeaderOptions();
  const { hasPermission, hasAnyPermission } = useCurrentBrandEmployee();

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
              <Stack screenOptions={screenOptions}>
                <Stack.Screen
                  name="(tabs)"
                  options={{
                    headerShown: false,
                    ...(drawerVisible && {
                      animation: 'none',
                    }),
                  }}
                />

                <Stack.Screen
                  name="account/preferences"
                  options={{
                    headerTitle: t('shared.profile'),
                  }}
                />
                <Stack.Screen name="account/remove" />

                <Stack.Screen
                  name="appearance/preferences"
                  options={{
                    headerTitle: t('shared.preferences.appearance.title'),
                  }}
                />

                <Stack.Protected
                  guard={!!currentBrands && !currentBrands.length}
                >
                  <Stack.Screen name="brand/create" />
                  <Stack.Screen
                    name="brand/new"
                    options={{
                      headerTitle: t('brand.create.new_brand'),
                    }}
                  />
                </Stack.Protected>

                <Stack.Protected guard={hasAnyPermission()}>
                  <Stack.Screen
                    name="brand/menu"
                    options={{
                      headerTitle: currentBrand?.name,
                    }}
                  />
                </Stack.Protected>

                <Stack.Protected guard={hasPermission('brandAll')}>
                  <Stack.Screen
                    name="brand/preferences"
                    options={{
                      headerTitle: t('brand.information.title'),
                    }}
                  />
                </Stack.Protected>

                <Stack.Screen
                  name="calendar/preferences"
                  options={{
                    headerTitle: t('shared.preferences.calendar.title'),
                  }}
                />

                <Stack.Protected guard={hasPermission('clientsAll')}>
                  <Stack.Screen
                    name="clients/[id]/profile"
                    options={{
                      headerTitle: t('brand.clients.profile.title'),
                    }}
                  />
                  <Stack.Screen name="clients/[id]/remove" />
                  <Stack.Screen
                    name="clients/[id]/update"
                    options={{
                      headerTitle: t('brand.clients.update.title'),
                    }}
                  />

                  <Stack.Screen
                    name="clients/create"
                    options={{
                      headerTitle: t('brand.clients.new_client'),
                    }}
                  />
                  <Stack.Screen name="clients/import" />
                  <Stack.Screen
                    name="clients/index"
                    options={{
                      ...(drawerVisible && {
                        animation: 'none',
                      }),
                      headerTitle: t('brand.clients.title'),
                      headerRight: () => (
                        <HeaderButton
                          iconName="AddCircle"
                          onPress={() => router.push('/clients/create')}
                        />
                      ),
                    }}
                  />
                </Stack.Protected>

                <Stack.Protected guard={hasPermission('employeesAll')}>
                  <Stack.Screen
                    name="employees/[id]/create"
                    options={{
                      headerTitle: t('brand.employees.new_employee'),
                      ...(drawerVisible && {
                        animation: 'none',
                      }),
                    }}
                  />
                  <Stack.Screen name="employees/[id]/remove" />
                  <Stack.Screen
                    name="employees/[id]/update"
                    options={{
                      headerTitle: t('brand.employees.update.title'),
                    }}
                  />
                  <Stack.Screen name="employees/create" />
                  <Stack.Screen
                    name="employees/index"
                    options={{
                      ...(drawerVisible && {
                        animation: 'none',
                      }),
                      headerTitle: t('brand.employees.title'),
                      headerRight: () => (
                        <HeaderButton
                          iconName="AddCircle"
                          onPress={() => router.push('/employees/create')}
                        />
                      ),
                    }}
                  />
                </Stack.Protected>

                <Stack.Screen
                  name="follow-us/index"
                  options={{
                    headerTitle: t('shared.follow_us'),
                    ...(drawerVisible && {
                      animation: 'none',
                    }),
                  }}
                />

                <Stack.Screen
                  name="help-feedback/index"
                  options={{
                    headerTitle: t('shared.faq.title'),
                    ...(drawerVisible && {
                      animation: 'none',
                    }),
                  }}
                />

                <Stack.Screen
                  name="language/preferences"
                  options={{
                    headerTitle: t('shared.preferences.language.title'),
                  }}
                />

                <Stack.Protected guard={hasPermission('locationsAll')}>
                  <Stack.Screen
                    name="locations/create"
                    options={{
                      headerTitle: t('brand.locations.new_location'),
                    }}
                  />

                  <Stack.Screen
                    name="locations/index"
                    options={{
                      ...(drawerVisible && {
                        animation: 'none',
                      }),
                      headerTitle: t('brand.locations.title'),
                      headerRight: () => (
                        <HeaderButton
                          iconName="AddCircle"
                          onPress={() => router.push('/locations/create')}
                        />
                      ),
                    }}
                  />
                  <Stack.Screen name="locations/[id]/remove" />
                  <Stack.Screen
                    name="locations/[id]/update"
                    options={{
                      headerTitle: t('brand.locations.update.title'),
                    }}
                  />
                </Stack.Protected>

                <Stack.Screen
                  name="notifications/index"
                  options={{
                    headerTitle: t('shared.notifications.title'),
                  }}
                />
                <Stack.Screen
                  name="notifications/preferences"
                  options={{
                    headerTitle: t('shared.preferences.notifications.title'),
                  }}
                />

                <Stack.Screen
                  name="terms-privacy/index"
                  options={{
                    headerTitle: t('shared.docs.terms_privacy'),
                    ...(drawerVisible && {
                      animation: 'none',
                    }),
                  }}
                />
              </Stack>
            )}
          </XStack>
        </NotificationsProvider>
      </SocketProvider>
    </StateProvider>
  );
};
