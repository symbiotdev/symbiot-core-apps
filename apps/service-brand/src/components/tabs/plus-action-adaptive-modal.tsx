import {
  AdaptivePopover,
  AdaptivePopoverRef,
  Br,
  defaultPageVerticalPadding,
  Icon,
  ListItem,
} from '@symbiot-core-apps/ui';
import React, { ReactElement, useCallback, useRef } from 'react';
import { useCurrentBrandEmployee } from '@symbiot-core-apps/state';
import { router } from 'expo-router';
import { View } from 'tamagui';
import { Placement } from '@floating-ui/react-native';
import { useAppSettings } from '@symbiot-core-apps/app';
import { BrandBookingType, BrandMembershipType } from '@symbiot-core-apps/api';
import { useAccountLimits } from '@symbiot-core-apps/account-subscription';
import { useI18n } from '@symbiot-core-apps/shared';

export const PlusActionAdaptiveModal = ({
  trigger,
  placement,
}: {
  trigger: ReactElement;
  placement?: Placement;
}) => {
  const { t } = useI18n();
  const { icons } = useAppSettings();
  const { tryAction } = useAccountLimits();
  const { hasPermission, hasAnyOfPermissions } = useCurrentBrandEmployee();
  const popoverRef = useRef<AdaptivePopoverRef>(null);

  const addClient = useCallback(() => {
    popoverRef.current?.close();
    tryAction('addClient', () => router.push('/clients/create'))();
  }, [tryAction]);

  const importClients = useCallback(() => {
    popoverRef.current?.close();
    tryAction('importClients', () => router.push('/clients/import'))();
  }, [tryAction]);

  const addEmployee = useCallback(() => {
    popoverRef.current?.close();
    tryAction('addEmployee', () => router.push('/employees/create'))();
  }, [tryAction]);

  const addLocation = useCallback(() => {
    popoverRef.current?.close();
    tryAction('addLocation', () => router.push('/locations/create'))();
  }, [tryAction]);

  const addService = useCallback(() => {
    popoverRef.current?.close();
    tryAction('addService', () => router.push('/services/create'))();
  }, [tryAction]);

  const addPeriodBasedMembership = useCallback(() => {
    popoverRef.current?.close();
    tryAction('addPeriodMembership', () =>
      router.push(`/memberships/${BrandMembershipType.period}/create`),
    )();
  }, [tryAction]);

  const addVisitBasedMembership = useCallback(() => {
    popoverRef.current?.close();
    tryAction('addVisitMembership', () =>
      router.push(`/memberships/${BrandMembershipType.visits}/create`),
    )();
  }, [tryAction]);

  const addServiceBooking = useCallback(() => {
    popoverRef.current?.close();
    router.push(`/bookings/${BrandBookingType.service}/create`);
  }, []);

  const addUnavailableBooking = useCallback(() => {
    popoverRef.current?.close();
    router.push(`/bookings/${BrandBookingType.unavailable}/create`);
  }, []);

  return (
    hasAnyOfPermissions(['employees', 'locations', 'catalog', 'clients']) && (
      <AdaptivePopover
        ignoreHapticOnOpen
        unmountChildrenWhenHidden
        ref={popoverRef}
        placement={placement}
        trigger={trigger}
      >
        <View
          marginVertical={-(defaultPageVerticalPadding / 2)}
          paddingHorizontal="$1"
        >
          {hasAnyOfPermissions(['employees', 'locations']) && (
            <>
              {hasPermission('locations') && (
                <ListItem
                  icon={<Icon name="MapPointWave" />}
                  label={t('navigation.tabs.plus.actions.add_location.label')}
                  onPress={addLocation}
                />
              )}

              {hasPermission('employees') && (
                <ListItem
                  icon={<Icon name="UsersGroupRounded" />}
                  label={t('navigation.tabs.plus.actions.add_employee.label')}
                  onPress={addEmployee}
                />
              )}
            </>
          )}

          {hasPermission('catalog') && (
            <>
              {hasAnyOfPermissions(['employees', 'locations']) && (
                <Br marginVertical="$2" />
              )}

              <ListItem
                icon={<Icon name={icons.Service} />}
                label={t('navigation.tabs.plus.actions.add_service.label')}
                onPress={addService}
              />
              <ListItem
                icon={<Icon name={icons.VisitBasedMembership} />}
                label={t(
                  'navigation.tabs.plus.actions.add_visit_based_membership.label',
                )}
                onPress={addVisitBasedMembership}
              />
              <ListItem
                icon={<Icon name={icons.PeriodBasedMembership} />}
                label={t(
                  'navigation.tabs.plus.actions.add_period_based_membership.label',
                )}
                onPress={addPeriodBasedMembership}
              />
            </>
          )}

          {hasPermission('clients') && (
            <>
              {hasAnyOfPermissions(['employees', 'locations', 'catalog']) && (
                <Br marginVertical="$2" />
              )}

              <ListItem
                icon={<Icon name="Import" />}
                label={t('navigation.tabs.plus.actions.import_client.label')}
                onPress={importClients}
              />
              <ListItem
                icon={<Icon name="SmileCircle" />}
                label={t('navigation.tabs.plus.actions.add_client.label')}
                onPress={addClient}
              />
            </>
          )}

          {hasPermission('bookings') && (
            <>
              {hasPermission('clients') && <Br marginVertical="$2" />}

              <ListItem
                icon={<Icon name={icons.ServiceBooking} />}
                label={t(
                  'navigation.tabs.plus.actions.add_service_booking.label',
                )}
                onPress={addServiceBooking}
              />

              <ListItem
                icon={<Icon name={icons.UnavailableBooking} />}
                label={t(
                  'navigation.tabs.plus.actions.add_unavailable_booking.label',
                )}
                onPress={addUnavailableBooking}
              />
            </>
          )}
        </View>
      </AdaptivePopover>
    )
  );
};
