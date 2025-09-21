import React, { useCallback } from 'react';
import { router } from 'expo-router';
import {
  FormView,
  Icon,
  ListItem,
  ListItemGroup,
  PageView,
  RegularText,
} from '@symbiot-core-apps/ui';
import { useTranslation } from 'react-i18next';
import { useCurrentBrandEmployee } from '@symbiot-core-apps/state';
import { View } from 'tamagui';
import { useApp } from '@symbiot-core-apps/app';

export default () => {
  const { t } = useTranslation();
  const { hasPermission, hasAnyOfPermissions } = useCurrentBrandEmployee();
  const { icons } = useApp();

  const onInformationPress = useCallback(
    () => router.push('/brand/update'),
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

  const onServicesPress = useCallback(
    () => router.push('/services/preferences'),
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
                label={t('brand_location.title')}
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

        <ListItemGroup title={t('shared.catalog')}>
          <ListItem
            label={t('brand.services.title')}
            icon={<Icon name={icons.Service} />}
            onPress={onServicesPress}
          />
          <ListItem
            label={t('brand.packages.title')}
            icon={<Icon name={icons.Package} />}
          />
          <ListItem
            label={t('brand.gift_cards.title')}
            icon={<Icon name="Gift" />}
            iconAfter={
              <View>
                <RegularText color="$placeholderColor" fontSize={12}>
                  {t('shared.coming_soon')}
                </RegularText>
              </View>
            }
          />
        </ListItemGroup>

        {hasPermission('clientsAll') && (
          <ListItemGroup title={t('brand.stakeholders')}>
            <ListItem
              label={t('brand_client.title')}
              icon={<Icon name="SmileCircle" />}
              onPress={onClientsPress}
            />
          </ListItemGroup>
        )}
      </FormView>
    </PageView>
  );
};
