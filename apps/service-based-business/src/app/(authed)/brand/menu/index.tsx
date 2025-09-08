import { useCallback } from 'react';
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
  const { hasPermission } = useCurrentBrandEmployee();

  const onInformationPress = useCallback(
    () => router.push('/brand/preferences'),
    [],
  );

  const onLocationsPress = useCallback(
    () => router.push('/locations'),
    [],
  );

  const onEmployeesPress = useCallback(
    () => router.push('/employees'),
    [],
  );

  const onClientsPress = useCallback(
    () => router.push('/clients'),
    [],
  );

  return (
    <PageView scrollable withHeaderHeight>
      <FormView>
        <ListItemGroup>
          {hasPermission('brandAll') && (
            <ListItem
              label={t('brand.information.title')}
              icon={<Icon name="InfoCircle" />}
              onPress={onInformationPress}
            />
          )}

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

          {hasPermission('clientsAll') && (
            <ListItem
              label={t('brand.clients.title')}
              icon={<Icon name="SmileCircle" />}
              onPress={onClientsPress}
            />
          )}
        </ListItemGroup>
      </FormView>
    </PageView>
  );
};
