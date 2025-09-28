import {
  AdaptivePopover,
  AdaptivePopoverRef,
  Br,
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

  const addMembership = useCallback(() => {
    popoverRef.current?.close();
    router.push('/memberships/create');
  }, []);

  return (
    <AdaptivePopover
      ref={popoverRef}
      triggerType="child"
      placement={placement}
      ignoreHapticOnOpen
      trigger={trigger}
    >
      <View gap="$3">
        {hasAnyOfPermissions(['employeesAll', 'locationsAll']) && (
          <View gap="$1">
            {hasPermission('locationsAll') && (
              <ListItem
                icon={<Icon name="MapPointWave" />}
                label={t('navigation.tabs.plus.actions.add_location.label')}
                onPress={addLocation}
              />
            )}

            {hasPermission('employeesAll') && (
              <ListItem
                icon={<Icon name="UsersGroupRounded" />}
                label={t('navigation.tabs.plus.actions.add_employee.label')}
                onPress={addEmployee}
              />
            )}
          </View>
        )}

        {hasAnyOfPermissions(['servicesAll', 'membershipsAll']) && (
          <>
            {hasAnyOfPermissions(['employeesAll', 'locationsAll']) && <Br />}

            {hasPermission('servicesAll') && (
              <ListItem
                icon={<Icon name={icons.Service} />}
                label={t('navigation.tabs.plus.actions.add_service.label')}
                onPress={addService}
              />
            )}

            {hasPermission('membershipsAll') && (
              <ListItem
                icon={<Icon name={icons.Membership} />}
                label={t('navigation.tabs.plus.actions.add_membership.label')}
                onPress={addMembership}
              />
            )}
          </>
        )}

        {hasAnyOfPermissions([
          'employeesAll',
          'locationsAll',
          'servicesAll',
          'membershipsAll',
        ]) && <Br />}

        {hasPermission('clientsAll') && (
          <View gap="$1">
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
          </View>
        )}
      </View>
    </AdaptivePopover>
  );
};
