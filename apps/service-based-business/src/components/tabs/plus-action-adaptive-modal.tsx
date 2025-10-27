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
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { View } from 'tamagui';
import { Placement } from '@floating-ui/react-native';
import { useApp } from '@symbiot-core-apps/app';
import { BrandBookingType, BrandMembershipType } from '@symbiot-core-apps/api';

export const PlusActionAdaptiveModal = ({
  trigger,
  placement,
}: {
  trigger: ReactElement;
  placement?: Placement;
}) => {
  const { t } = useTranslation();
  const { icons } = useApp();
  const { hasPermission, hasAnyOfPermissions } = useCurrentBrandEmployee();
  const popoverRef = useRef<AdaptivePopoverRef>(null);

  const addClient = useCallback(() => {
    popoverRef.current?.close();
    router.push('/clients/create');
  }, []);

  const importClients = useCallback(() => {
    popoverRef.current?.close();
    router.push('/clients/import');
  }, []);

  const addEmployee = useCallback(() => {
    popoverRef.current?.close();
    router.push('/employees/create');
  }, []);

  const addLocation = useCallback(() => {
    popoverRef.current?.close();
    router.push('/locations/create');
  }, []);

  const addService = useCallback(() => {
    popoverRef.current?.close();
    router.push('/services/create');
  }, []);

  const addPeriodBasedMembership = useCallback(() => {
    popoverRef.current?.close();
    router.push(`/memberships/${BrandMembershipType.period}/create`);
  }, []);

  const addVisitBasedMembership = useCallback(() => {
    popoverRef.current?.close();
    router.push(`/memberships/${BrandMembershipType.visits}/create`);
  }, []);

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
        ref={popoverRef}
        placement={placement}
        ignoreHapticOnOpen
        trigger={trigger}
      >
        <View gap="$1" marginVertical={-(defaultPageVerticalPadding / 2)}>
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
              {hasAnyOfPermissions(['employees', 'locations']) && <Br />}

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
                <Br />
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
              {hasAnyOfPermissions(['clients']) && <Br />}

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
