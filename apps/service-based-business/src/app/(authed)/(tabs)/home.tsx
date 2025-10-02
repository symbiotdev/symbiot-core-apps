import {
  Avatar,
  FormView,
  H3,
  HeaderButton,
  headerButtonSize,
  Icon,
  ListItem,
  ListItemGroup,
  PageView,
  RegularText,
  useDrawer,
} from '@symbiot-core-apps/ui';
import {
  useCurrentAccountState,
  useCurrentBrandEmployee,
  useCurrentBrandState,
} from '@symbiot-core-apps/state';
import { InitialAction } from '../../../components/brand/initial-action';
import { router, useNavigation } from 'expo-router';
import React, { useCallback, useLayoutEffect } from 'react';
import { useApp } from '@symbiot-core-apps/app';
import { useTranslation } from 'react-i18next';
import { View, XStack } from 'tamagui';
import { emitHaptic } from '@symbiot-core-apps/shared';

export default () => {
  const { me, stats } = useCurrentAccountState();
  const { brand: currentBrand } = useCurrentBrandState();
  const { icons } = useApp();
  const { t } = useTranslation();
  const { visible: drawerVisible } = useDrawer();
  const { hasPermission, hasAnyOfPermissions } = useCurrentBrandEmployee();
  const navigation = useNavigation();

  const headerLeft = useCallback(() => {
    if (currentBrand) {
      return (
        <XStack
          pressStyle={{ opacity: 0.8 }}
          alignItems="center"
          gap="$2"
          onPress={() => {
            emitHaptic();
            router.push('/brand/profile');
          }}
        >
          <Avatar
            name={currentBrand.name}
            url={currentBrand.avatarXsUrl}
            size={30}
          />
          <H3 lineHeight={headerButtonSize} numberOfLines={1}>
            {currentBrand.name}
          </H3>
        </XStack>
      );
    } else if (me?.firstname) {
      return (
        <H3 lineHeight={headerButtonSize} numberOfLines={1}>
          {t('shared.greeting_firstname', {
            firstname: me.firstname,
          })}
        </H3>
      );
    } else return null;
  }, [currentBrand, me?.firstname, t]);

  const headerRight = useCallback(
    () =>
      !drawerVisible && (
        <HeaderButton
          attention={!!stats.newNotifications}
          iconName={icons.Notifications}
          onPress={() => router.push('/notifications')}
        />
      ),
    [drawerVisible, icons.Notifications, stats.newNotifications],
  );

  const onLocationsPress = useCallback(() => router.push('/locations'), []);
  const onEmployeesPress = useCallback(() => router.push('/employees'), []);
  const onClientsPress = useCallback(() => router.push('/clients'), []);
  const onServicesPress = useCallback(() => router.push('/services'), []);
  const onMembershipsPress = useCallback(() => router.push('/memberships'), []);
  const onTicketsPress = useCallback(() => router.push('/tickets'), []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft,
      headerRight,
    });
  }, [headerLeft, headerRight, navigation]);

  if (!currentBrand) {
    return <InitialAction />;
  }

  return (
    <PageView scrollable withHeaderHeight>
      <FormView gap="$3">
        {hasPermission('clientsAll') && (
          <ListItemGroup title={t('brand.stakeholders')}>
            <ListItem
              label={t('brand_client.title')}
              icon={<Icon name="SmileCircle" />}
              onPress={onClientsPress}
            />
          </ListItemGroup>
        )}

        {hasAnyOfPermissions([
          'servicesAll',
          'membershipsAll',
          'ticketsAll',
          'giftsAll',
        ]) && (
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
      </FormView>
    </PageView>
  );
};
