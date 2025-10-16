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
  const { tokens } = useAuthTokens();
  const { brand: currentBrand, brands: currentBrands } = useCurrentBrandState();
  const { t } = useTranslation();
  const { visible: drawerVisible } = useDrawer();
  const screenOptions = useStackScreenHeaderOptions();
  const currentEntitiesLoaded = useCurrentEntitiesLoader();
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

                {/*ACCOUNT*/}

                <Stack.Screen
                  name="account/update"
                  options={{
                    headerTitle: t('shared.profile'),
                  }}
                />
                <Stack.Screen name="account/remove" />

                {/*APP*/}

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

                {/*APPEARANCE*/}

                <Stack.Screen
                  name="appearance/preferences"
                  options={{
                    headerTitle: t('shared.preferences.appearance.title'),
                  }}
                />

                {/*BRAND*/}

                <Stack.Protected
                  guard={
                    !!currentBrands && !currentBrands.length && !currentBrand
                  }
                >
                  <Stack.Screen name="brand/create" />
                  <Stack.Screen
                    name="brand/new"
                    options={{
                      headerTitle: t('brand.create.new_brand'),
                    }}
                  />
                </Stack.Protected>

                <Stack.Protected guard={!!currentBrand}>
                  <Stack.Screen name="brand/profile" />

                  <Stack.Protected guard={hasPermission('analyticsAll')}>
                    <Stack.Screen
                      name="brand/analytics"
                      options={{
                        ...(drawerVisible && {
                          animation: 'none',
                        }),
                        headerTitle: t('brand.analytics.title'),
                      }}
                    />
                  </Stack.Protected>

                  <Stack.Protected guard={hasPermission('brandAll')}>
                    <Stack.Screen
                      name="brand/update"
                      options={{
                        headerTitle: t('brand.information.title'),
                      }}
                    />
                  </Stack.Protected>
                </Stack.Protected>

                {/*CALENDAR*/}

                <Stack.Screen
                  name="calendar/preferences"
                  options={{
                    headerTitle: t('shared.preferences.calendar.title'),
                  }}
                />

                {/*CLIENTS*/}

                <Stack.Protected guard={hasPermission('clientsAll')}>
                  <Stack.Protected guard={hasPermission('analyticsAll')}>
                    <Stack.Screen
                      name="clients/[id]/analytics"
                      options={{
                        headerTitle: t('brand_client.analytics.title'),
                      }}
                    />
                  </Stack.Protected>

                  <Stack.Protected guard={hasPermission('catalogAll')}>
                    <Stack.Screen name="clients/[id]/memberships/[membershipId]/update" />
                    <Stack.Screen name="clients/[id]/memberships/[membershipId]/remove" />
                    <Stack.Screen name="clients/[id]/memberships/[type]/index" />
                  </Stack.Protected>

                  <Stack.Protected guard={hasPermission('financesAll')}>
                    <Stack.Screen name="clients/[id]/transactions" />
                  </Stack.Protected>

                  <Stack.Screen name="clients/[id]/remove" />
                  <Stack.Screen
                    name="clients/[id]/update"
                    options={{
                      headerTitle: t('brand_client.update.title'),
                    }}
                  />
                  <Stack.Screen
                    name="clients/[id]/profile"
                    options={{
                      headerTitle: t('brand_client.profile.title'),
                    }}
                  />

                  <Stack.Screen
                    name="clients/create"
                    options={{
                      headerTitle: t('brand_client.create.new_client'),
                    }}
                  />
                  <Stack.Screen
                    name="clients/import"
                    options={{
                      headerTitle: t('brand_client.import.title'),
                    }}
                  />
                  <Stack.Screen
                    name="clients/index"
                    options={{
                      ...(drawerVisible && {
                        animation: 'none',
                      }),
                      headerTitle: t('brand_client.title'),
                    }}
                  />
                </Stack.Protected>

                {/*EMPLOYEES*/}

                <Stack.Protected guard={hasPermission('employeesAll')}>
                  <Stack.Protected guard={hasPermission('analyticsAll')}>
                    <Stack.Screen
                      name="employees/[id]/analytics"
                      options={{
                        headerTitle: t('brand_employee.analytics.title'),
                      }}
                    />
                  </Stack.Protected>
                  <Stack.Screen name="employees/[id]/remove" />
                  <Stack.Screen
                    name="employees/[id]/create"
                    options={{
                      headerTitle: t('brand_employee.create.new_employee'),
                      ...(drawerVisible && {
                        animation: 'none',
                      }),
                    }}
                  />
                  <Stack.Screen
                    name="employees/[id]/update"
                    options={{
                      headerTitle: t('brand_employee.update.title'),
                    }}
                  />
                  <Stack.Screen
                    name="employees/[id]/profile"
                    options={{
                      headerTitle: t('brand_employee.profile.title'),
                    }}
                  />

                  <Stack.Screen name="employees/create" />
                  <Stack.Screen
                    name="employees/index"
                    options={{
                      ...(drawerVisible && {
                        animation: 'none',
                      }),
                      headerTitle: t('brand_employee.title'),
                    }}
                  />
                </Stack.Protected>

                {/*LANGUAGE*/}

                <Stack.Screen
                  name="language/preferences"
                  options={{
                    headerTitle: t('shared.preferences.language.title'),
                  }}
                />

                {/*LOCATIONS*/}

                <Stack.Protected guard={hasPermission('locationsAll')}>
                  <Stack.Protected guard={hasPermission('analyticsAll')}>
                    <Stack.Screen
                      name="locations/[id]/analytics"
                      options={{
                        headerTitle: t('brand_location.analytics.title'),
                      }}
                    />
                  </Stack.Protected>
                  <Stack.Screen name="locations/[id]/remove" />
                  <Stack.Screen
                    name="locations/[id]/update"
                    options={{
                      headerTitle: t('brand_location.update.title'),
                    }}
                  />
                  <Stack.Screen
                    name="locations/[id]/profile"
                    options={{
                      headerTitle: t('brand_location.profile.title'),
                    }}
                  />
                  <Stack.Screen
                    name="locations/create"
                    options={{
                      headerTitle: t('brand_location.new_location'),
                    }}
                  />
                  <Stack.Screen
                    name="locations/index"
                    options={{
                      ...(drawerVisible && {
                        animation: 'none',
                      }),
                      headerTitle: t('brand_location.title'),
                    }}
                  />
                </Stack.Protected>

                {/*MEMBERSHIPS*/}

                <Stack.Protected guard={hasPermission('catalogAll')}>
                  <Stack.Protected guard={hasPermission('analyticsAll')}>
                    <Stack.Screen name="memberships/[type]/[id]/analytics" />
                  </Stack.Protected>
                  <Stack.Screen name="memberships/[type]/[id]/remove" />
                  <Stack.Screen name="memberships/[type]/[id]/update" />
                  <Stack.Screen name="memberships/[type]/[id]/profile" />
                  <Stack.Screen name="memberships/[type]/create" />
                  <Stack.Screen
                    name="memberships/[type]/index"
                    options={{
                      ...(drawerVisible && {
                        animation: 'none',
                      }),
                    }}
                  />
                </Stack.Protected>

                {/*NOTIFICATIONS*/}

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

                {/*SERVICES*/}

                <Stack.Protected guard={hasPermission('catalogAll')}>
                  <Stack.Protected guard={hasPermission('analyticsAll')}>
                    <Stack.Screen
                      name="services/[id]/analytics"
                      options={{
                        headerTitle: t('brand_service.analytics.title'),
                      }}
                    />
                  </Stack.Protected>
                  <Stack.Screen name="services/[id]/remove" />
                  <Stack.Screen
                    name="services/[id]/update"
                    options={{
                      headerTitle: t('brand_service.update.title'),
                    }}
                  />
                  <Stack.Screen
                    name="services/[id]/profile"
                    options={{
                      headerTitle: t('brand_service.profile.title'),
                    }}
                  />
                  <Stack.Screen
                    name="services/create"
                    options={{
                      headerTitle: t('brand_service.create.new_service'),
                    }}
                  />
                  <Stack.Screen
                    name="services/index"
                    options={{
                      ...(drawerVisible && {
                        animation: 'none',
                      }),
                      headerTitle: t('brand_service.title'),
                    }}
                  />
                </Stack.Protected>

                {/*TRANSACTIONS*/}

                <Stack.Protected guard={hasPermission('financesAll')}>
                  <Stack.Screen
                    name="transactions/index"
                    options={{
                      ...(drawerVisible && {
                        animation: 'none',
                      }),
                      headerTitle: t('brand_transaction.title'),
                    }}
                  />
                </Stack.Protected>
              </Stack>
            )}

            {drawerVisible && !!currentBrand && <PlusButton />}
          </XStack>
        </NotificationsProvider>
      </SocketProvider>
    </StateProvider>
  );
};
