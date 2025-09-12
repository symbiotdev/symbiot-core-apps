import React, { useCallback } from 'react';
import { router } from 'expo-router';
import {
  FormView,
  Icon,
  ListItem,
  ListItemGroup,
  PageView,
} from '@symbiot-core-apps/ui';
import { useTranslation } from 'react-i18next';
import { useCurrentBrandEmployee } from '@symbiot-core-apps/state';

export default () => {
  const { t } = useTranslation();
  const { hasPermission, hasAnyOfPermissions } = useCurrentBrandEmployee();

  const onInformationPress = useCallback(
    () => router.push('/brand/preferences'),
    [],
  );

  const onLocationsPress = useCallback(
    () => router.push('/locations/preferences'),
    [],
  );

  const onEmployeesPress = useCallback(
    () => router.push('/employees/preferences'),
    [],
  );

  const onClientsPress = useCallback(
    () => router.push('/clients/preferences'),
    [],
  );

  return (
    <PageView scrollable withHeaderHeight>
      <FormView gap="$3">
        {hasPermission('brandAll') && (
          <ListItemGroup title={t('brand.title')}>
            <ListItem
              label={t('brand.information.short_title')}
              icon={<Icon name="InfoCircle" />}
              onPress={onInformationPress}
            />
          </ListItemGroup>
        )}

        {hasAnyOfPermissions(['employeesAll', 'locationsAll']) && (
          <ListItemGroup title={t('brand.infrastructure')}>
            {hasPermission('locationsAll') && (
              <ListItem
                label={t('brand.locations.title')}
                icon={<Icon name="MapPointWave" />}
                onPress={onLocationsPress}
              />
            )}

            {hasPermission('employeesAll') && (
              <ListItem
                label={t('brand.employees.title')}
                icon={<Icon name="UsersGroupRounded" />}
                onPress={onEmployeesPress}
              />
            )}
          </ListItemGroup>
        )}

        {hasPermission('clientsAll') && (
          <ListItemGroup title={t('brand.stakeholders')}>
            <ListItem
              label={t('brand.clients.title')}
              icon={<Icon name="SmileCircle" />}
              onPress={onClientsPress}
            />
          </ListItemGroup>
        )}
      </FormView>
    </PageView>
  );
};
