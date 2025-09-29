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

  const onMembershipsPress = useCallback(
    () => router.push('/memberships/preferences'),
    [],
  );

  const onTicketsPress = useCallback(
    () => router.push('/tickets/preferences'),
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
                label={t('brand_employee.title')}
                icon={<Icon name="UsersGroupRounded" />}
                onPress={onEmployeesPress}
              />
            )}
          </ListItemGroup>
        )}

        {hasAnyOfPermissions(['servicesAll', 'membershipsAll', 'ticketsAll', 'giftsAll']) && (
          <ListItemGroup title={t('shared.catalog')}>
            {hasPermission('servicesAll') && (
              <ListItem
                label={t('brand_service.title')}
                icon={<Icon name={icons.Service} />}
                onPress={onServicesPress}
              />
            )}

            {hasPermission('membershipsAll') && (
              <ListItem
                label={t('brand_membership.title')}
                icon={<Icon name={icons.Membership} />}
                onPress={onMembershipsPress}
              />
            )}

            {hasPermission('ticketsAll') && (
              <ListItem
                label={t('brand_ticket.title')}
                icon={<Icon name={icons.Ticket} />}
                onPress={onTicketsPress}
              />
            )}
            {/*<ListItem*/}
            {/*  label={t('brand_package.title')}*/}
            {/*  icon={<Icon name={icons.Package} />}*/}
            {/*/>*/}
            {hasPermission('giftsAll') && (
              <ListItem
                label={t('brand_gift_card.title')}
                icon={<Icon name="Gift" />}
                iconAfter={
                  <View>
                    <RegularText color="$placeholderColor" fontSize={12}>
                      {t('shared.coming_soon')}
                    </RegularText>
                  </View>
                }
              />
            )}
          </ListItemGroup>
        )}

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
