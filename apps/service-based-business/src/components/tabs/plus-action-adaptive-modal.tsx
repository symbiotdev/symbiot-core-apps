import {
  AdaptivePopover,
  AdaptivePopoverRef,
  HapticTabBarButton,
  Icon,
  ListItem,
} from '@symbiot-core-apps/ui';
import React, { useCallback, useRef } from 'react';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { useCurrentBrandEmployee } from '@symbiot-core-apps/state';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';

export const PlusActionAdaptiveModal = (props: BottomTabBarButtonProps) => {
  const { t } = useTranslation();
  const { hasPermission } = useCurrentBrandEmployee();
  const popoverRef = useRef<AdaptivePopoverRef>(null);

  const addClient = useCallback(() => {
    popoverRef.current?.close();
    router.push('/clients/create');
  }, []);

  const addEmployee = useCallback(() => {
    popoverRef.current?.close();
    router.push('/brand/create');
  }, []);

  const addLocation = useCallback(() => {
    popoverRef.current?.close();
    router.push('/locations/create');
  }, []);

  return (
    <AdaptivePopover
      ref={popoverRef}
      triggerType="child"
      ignoreHapticOnOpen
      trigger={
        <HapticTabBarButton style={props.style} children={props.children} />
      }
    >
      {hasPermission('clientsAll') && (
        <ListItem
          icon={<Icon name="SmileCircle" />}
          label={t('navigation.tabs.plus.actions.add_client.label')}
          onPress={addClient}
        />
      )}

      {hasPermission('employeesAll') && (
        <ListItem
          icon={<Icon name="UsersGroupRounded" />}
          label={t('navigation.tabs.plus.actions.add_employee.label')}
          onPress={addEmployee}
        />
      )}

      {hasPermission('locationsAll') && (
        <ListItem
          icon={<Icon name="MapPointWave" />}
          label={t('navigation.tabs.plus.actions.add_location.label')}
          onPress={addLocation}
        />
      )}
    </AdaptivePopover>
  );
};
