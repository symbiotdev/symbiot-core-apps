import { Br, Icon, IconName, RegularText } from '@symbiot-core-apps/ui';
import React, { ReactElement, useCallback, useRef } from 'react';
import { useCurrentBrandEmployee } from '@symbiot-core-apps/state';
import { router } from 'expo-router';
import { XStack, XStackProps } from 'tamagui';
import { useAppSettings } from '@symbiot-core-apps/app';
import { BrandBookingType, BrandMembershipType } from '@symbiot-core-apps/api';
import { useAccountLimits } from '@symbiot-core-apps/account-subscription';
import { useI18n } from '@symbiot-core-apps/shared';
import { ScrollView } from 'react-native';
import { AdaptiveSheet, AdaptiveSheetRef } from '@symbiot-core-apps/ui2';

const ListItem = ({
  iconName,
  label,
  ...xStackProps
}: XStackProps & { iconName: IconName; label: string }) => {
  return (
    <XStack
      gap="$4"
      paddingVertical="$2"
      alignItems="center"
      cursor="pointer"
      {...xStackProps}
    >
      <Icon name={iconName} />
      <RegularText numberOfLines={1}>{label}</RegularText>
    </XStack>
  );
};

export const PlusActionAdaptiveModal = ({
  trigger,
}: {
  trigger: ReactElement;
}) => {
  const { t } = useI18n();
  const { icons } = useAppSettings();
  const { tryAction } = useAccountLimits();
  const { hasPermission, hasAnyOfPermissions } = useCurrentBrandEmployee();
  const sheetRef = useRef<AdaptiveSheetRef>(null);

  const addClient = useCallback(() => {
    sheetRef.current?.hide();
    tryAction('addClient', () => router.push('/clients/create'))();
  }, [tryAction]);

  const importClients = useCallback(() => {
    sheetRef.current?.hide();
    tryAction('importClients', () => router.push('/clients/import'))();
  }, [tryAction]);

  const addEmployee = useCallback(() => {
    sheetRef.current?.hide();
    tryAction('addEmployee', () => router.push('/employees/create'))();
  }, [tryAction]);

  const addLocation = useCallback(() => {
    sheetRef.current?.hide();
    tryAction('addLocation', () => router.push('/locations/create'))();
  }, [tryAction]);

  const addService = useCallback(() => {
    sheetRef.current?.hide();
    tryAction('addService', () => router.push('/services/create'))();
  }, [tryAction]);

  const addPeriodBasedMembership = useCallback(() => {
    sheetRef.current?.hide();
    tryAction('addPeriodMembership', () =>
      router.push(`/memberships/${BrandMembershipType.period}/create`),
    )();
  }, [tryAction]);

  const addVisitBasedMembership = useCallback(() => {
    sheetRef.current?.hide();
    tryAction('addVisitMembership', () =>
      router.push(`/memberships/${BrandMembershipType.visits}/create`),
    )();
  }, [tryAction]);

  const addServiceBooking = useCallback(() => {
    sheetRef.current?.hide();
    router.push(`/bookings/${BrandBookingType.service}/create`);
  }, []);

  const addUnavailableBooking = useCallback(() => {
    sheetRef.current?.hide();
    router.push(`/bookings/${BrandBookingType.unavailable}/create`);
  }, []);

  return (
    hasAnyOfPermissions(['employees', 'locations', 'catalog', 'clients']) && (
      <AdaptiveSheet
        excludePaddings
        popoverPlacement="left-end"
        ref={sheetRef}
        trigger={trigger}
      >
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          {hasAnyOfPermissions(['employees', 'locations']) && (
            <>
              {hasPermission('locations') && (
                <ListItem
                  iconName="MapPointWave"
                  label={t('navigation.tabs.plus.actions.add_location.label')}
                  onPress={addLocation}
                />
              )}

              {hasPermission('employees') && (
                <ListItem
                  iconName="UsersGroupRounded"
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
                iconName={icons.Service}
                label={t('navigation.tabs.plus.actions.add_service.label')}
                onPress={addService}
              />
              <ListItem
                iconName={icons.VisitBasedMembership}
                label={t(
                  'navigation.tabs.plus.actions.add_visit_based_membership.label',
                )}
                onPress={addVisitBasedMembership}
              />
              <ListItem
                iconName={icons.PeriodBasedMembership}
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
                iconName="Import"
                label={t('navigation.tabs.plus.actions.import_client.label')}
                onPress={importClients}
              />
              <ListItem
                iconName="SmileCircle"
                label={t('navigation.tabs.plus.actions.add_client.label')}
                onPress={addClient}
              />
            </>
          )}

          {hasPermission('bookings') && (
            <>
              {hasPermission('clients') && <Br marginVertical="$2" />}

              <ListItem
                iconName={icons.ServiceBooking}
                label={t(
                  'navigation.tabs.plus.actions.add_service_booking.label',
                )}
                onPress={addServiceBooking}
              />

              <ListItem
                iconName={icons.UnavailableBooking}
                label={t(
                  'navigation.tabs.plus.actions.add_unavailable_booking.label',
                )}
                onPress={addUnavailableBooking}
              />
            </>
          )}
        </ScrollView>
      </AdaptiveSheet>
    )
  );
};
