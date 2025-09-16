import {
  Button,
  defaultPageHorizontalPadding,
  defaultPageVerticalPadding,
  LoadingView,
  useDrawer,
  useStackScreenHeaderOptions,
} from '@symbiot-core-apps/ui';
import { Redirect, Stack, usePathname } from 'expo-router';
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
import { PlusActionAdaptiveModal } from '../../components/tabs/plus-action-adaptive-modal';

const PlusButton = () => {
  const pathname = usePathname();

  return (
    pathname.split('/').filter(Boolean).length === 1 && (
      <PlusActionAdaptiveModal
        placement="top-end"
        trigger={
          <Button
            paddingHorizontal={0}
            label="+"
            fontSize={25}
            borderRadius={50}
            width={50}
            height={50}
            position="absolute"
            right={defaultPageHorizontalPadding}
            bottom={defaultPageVerticalPadding}
          />
        }
      />
    )
  );
};

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

                <Stack.Protected guard={hasPermission('analyticsAll')}>
                  <Stack.Screen
                    name="analytics/index"
                    options={{
                      ...(drawerVisible && {
                        animation: 'none',
                      }),
                      headerTitle: t('brand.analytics.title'),
                    }}
                  />
                </Stack.Protected>

                <Stack.Screen
                  name="app/follow-us"
                  options={{
                    headerTitle: t('shared.follow_us'),
                  }}
                />

                <Stack.Screen
                  name="app/help-feedback"
                  options={{
                    headerTitle: t('shared.faq.title'),
                    ...(drawerVisible && {
                      animation: 'none',
                    }),
                  }}
                />

                <Stack.Screen
                  name="app/terms-privacy"
                  options={{
                    headerTitle: t('shared.docs.terms_privacy'),
                  }}
                />

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
                  <Stack.Screen name="clients/[id]/remove" />
                  <Stack.Screen
                    name="clients/[id]/update"
                    options={{
                      headerTitle: t('brand.clients.update.title'),
                    }}
                  />
                  <Stack.Screen
                    name="clients/[id]/profile"
                    options={{
                      headerTitle: t('brand.clients.profile.title'),
                    }}
                  />
                  <Stack.Screen
                    name="clients/[id]/analytics"
                    options={{
                      headerTitle: t('brand.clients.analytics.title'),
                    }}
                  />

                  <Stack.Screen
                    name="clients/create"
                    options={{
                      headerTitle: t('brand.clients.new_client'),
                    }}
                  />
                  <Stack.Screen
                    name="clients/import"
                    options={{
                      headerTitle: t('brand.clients.import.title'),
                    }}
                  />
                  <Stack.Screen
                    name="clients/preferences/index"
                    options={{
                      headerTitle: t('brand.clients.title'),
                    }}
                  />
                  <Stack.Screen
                    name="clients/index"
                    options={{
                      ...(drawerVisible && {
                        animation: 'none',
                      }),
                      headerTitle: t('brand.clients.title'),
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
                  <Stack.Screen
                    name="employees/[id]/profile"
                    options={{
                      headerTitle: t('brand.employees.profile.title'),
                    }}
                  />
                  <Stack.Screen
                    name="employees/[id]/analytics"
                    options={{
                      headerTitle: t('brand.employees.analytics.title'),
                    }}
                  />
                  <Stack.Screen name="employees/create" />
                  <Stack.Screen
                    name="employees/preferences/index"
                    options={{
                      headerTitle: t('brand.employees.title'),
                    }}
                  />
                  <Stack.Screen
                    name="employees/index"
                    options={{
                      ...(drawerVisible && {
                        animation: 'none',
                      }),
                      headerTitle: t('brand.employees.title'),
                    }}
                  />
                </Stack.Protected>

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
                    name="locations/preferences/index"
                    options={{
                      headerTitle: t('brand.locations.title'),
                    }}
                  />

                  <Stack.Screen
                    name="locations/index"
                    options={{
                      ...(drawerVisible && {
                        animation: 'none',
                      }),
                      headerTitle: t('brand.locations.title'),
                    }}
                  />
                  <Stack.Screen name="locations/[id]/remove" />
                  <Stack.Screen
                    name="locations/[id]/update"
                    options={{
                      headerTitle: t('brand.locations.update.title'),
                    }}
                  />
                  <Stack.Screen
                    name="locations/[id]/profile"
                    options={{
                      headerTitle: t('brand.locations.profile.title'),
                    }}
                  />
                  <Stack.Screen
                    name="locations/[id]/analytics"
                    options={{
                      headerTitle: t('brand.locations.analytics.title'),
                    }}
                  />
                </Stack.Protected>

                <Stack.Screen
                  name="notifications/index"
                  options={{
                    ...(drawerVisible && {
                      animation: 'none',
                    }),
                    headerTitle: t('shared.notifications.title'),
                  }}
                />
                <Stack.Screen
                  name="notifications/preferences"
                  options={{
                    headerTitle: t('shared.preferences.notifications.title'),
                  }}
                />

                <Stack.Protected guard={hasPermission('servicesAll')}>
                  <Stack.Screen
                    name="services/preferences/index"
                    options={{
                      headerTitle: t('brand.services.title'),
                    }}
                  />
                  <Stack.Screen
                    name="services/create"
                    options={{
                      headerTitle: t('brand.services.new_service'),
                    }}
                  />
                  <Stack.Screen
                    name="services/index"
                    options={{
                      ...(drawerVisible && {
                        animation: 'none',
                      }),
                      headerTitle: t('brand.services.title'),
                    }}
                  />

                  <Stack.Screen
                    name="services/[id]/profile"
                    options={{
                      headerTitle: t('brand.services.profile.title'),
                    }}
                  />
                </Stack.Protected>
              </Stack>
            )}

            {drawerVisible && <PlusButton />}
          </XStack>
        </NotificationsProvider>
      </SocketProvider>
    </StateProvider>
  );
};
