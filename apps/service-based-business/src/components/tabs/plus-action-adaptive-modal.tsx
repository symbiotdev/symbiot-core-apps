import {
  AdaptivePopover,
  AdaptivePopoverRef,
  Br,
  HapticTabBarButton,
  Icon,
  ListItem,
} from '@symbiot-core-apps/ui';
import React, { useCallback, useRef } from 'react';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { useCurrentBrandEmployee } from '@symbiot-core-apps/state';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { View } from 'tamagui';

export const PlusActionAdaptiveModal = (props: BottomTabBarButtonProps) => {
  const { t } = useTranslation();
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

  const hasClientsPermission = hasPermission('clientsAll');
  const hasInfrastructurePermissions = hasAnyOfPermissions([
    'employeesAll',
    'locationsAll',
  ]);

  return (
    <AdaptivePopover
      ref={popoverRef}
      triggerType="child"
      ignoreHapticOnOpen
      trigger={
        <HapticTabBarButton style={props.style} children={props.children} />
      }
    >
      <View gap="$3">
        {hasInfrastructurePermissions && (
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

        {hasInfrastructurePermissions && hasClientsPermission && <Br />}

        {hasClientsPermission && (
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
