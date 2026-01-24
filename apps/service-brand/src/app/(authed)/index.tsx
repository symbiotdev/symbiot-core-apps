import { onPressNotification } from '../../utils/notification';
import { DrawerMenu } from '../../components/drawer/menu';
import React, { useEffect } from 'react';
import { XStack } from 'tamagui';
import { AccountSubscriptionProvider } from '@symbiot-core-apps/account-subscription';
import { SocketProvider } from '../../providers/socket.provider';
import { NotificationsProvider } from '@symbiot-core-apps/notification';
import {
  Button,
  defaultPageHorizontalPadding,
  defaultPageVerticalPadding,
  LoadingView,
  useDrawer,
} from '@symbiot-core-apps/ui';
import { Slot, usePathname } from 'expo-router';
import {
  useCurrentBrandBookingsState,
  useCurrentBrandEmployee,
  useCurrentBrandState,
} from '@symbiot-core-apps/state';
import { useCurrentEntitiesLoader } from '../../hooks/use-current-entities-loader';
import { useCurrentBrandLocationsReq } from '@symbiot-core-apps/api';
import { hideAsync } from 'expo-splash-screen';
import { isEqual } from '@symbiot-core-apps/shared';
import { PlusActionAdaptiveModal } from '../../components/tabs/plus-action-adaptive-modal';

export default () => {
  const { visible: drawerVisible } = useDrawer();
  const { loaded: currentEntitiesLoaded, refetchCurrentAccount } =
    useCurrentEntitiesLoader();
  const { hasPermission } = useCurrentBrandEmployee();
  const { brand: currentBrand } = useCurrentBrandState();
  const { location, setLocation } = useCurrentBrandBookingsState();

  const { data: locations } = useCurrentBrandLocationsReq({
    enabled: hasPermission('locations'),
  });

  useEffect(() => {
    if (currentEntitiesLoaded) {
      void hideAsync();
    }
  }, [currentEntitiesLoaded]);

  useEffect(() => {
    if (locations?.items) {
      if (
        location &&
        !locations.items.some((locationItem) => isEqual(locationItem, location))
      ) {
        setLocation(null);
      } else if (!location && locations.items.length === 1) {
        setLocation(locations.items[0]);
      }
    }
  }, [location, locations, setLocation]);

  return (
    <AccountSubscriptionProvider>
      <SocketProvider refetchCurrentAccount={refetchCurrentAccount}>
        <NotificationsProvider onPressNotification={onPressNotification}>
          <XStack flex={1}>
            {drawerVisible && <DrawerMenu />}

            {!currentEntitiesLoaded ? <LoadingView /> : <Slot />}

            {drawerVisible && !!currentBrand && <PlusButton />}
          </XStack>
        </NotificationsProvider>
      </SocketProvider>
    </AccountSubscriptionProvider>
  );
};

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
