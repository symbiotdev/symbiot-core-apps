import {
  Avatar,
  FormView,
  H3,
  HeaderButton,
  headerButtonSize,
  Icon,
  InitView,
  ListItem,
  ListItemGroup,
  RegularText,
  TabsPageView,
  useDrawer,
} from '@symbiot-core-apps/ui';
import {
  useCurrentAccountState,
  useCurrentBrandEmployee,
  useCurrentBrandState,
} from '@symbiot-core-apps/state';
import { InitialAction } from '../../../components/brand/initial-action';
import { router, useNavigation } from 'expo-router';
import React, { useCallback, useLayoutEffect, useMemo } from 'react';
import { useApp } from '@symbiot-core-apps/app';
import { useTranslation } from 'react-i18next';
import { View, XStack } from 'tamagui';
import {
  DateHelper,
  emitHaptic,
  useNativeNow,
} from '@symbiot-core-apps/shared';
import {
  BrandBookingType,
  BrandMembershipType,
  getTranslateKeyByBrandMembershipType,
} from '@symbiot-core-apps/api';
import { useBrandBookingLoader } from '@symbiot-core-apps/brand-booking';

export default () => {
  const { me, stats } = useCurrentAccountState();
  const { brand: currentBrand } = useCurrentBrandState();
  const { icons } = useApp();
  const { t } = useTranslation();
  const { visible: drawerVisible } = useDrawer();
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
            url={currentBrand.avatar?.xsUrl}
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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft,
      headerRight,
    });
  }, [headerLeft, headerRight, navigation]);

  if (!currentBrand) {
    return <InitialAction />;
  }

  return <BrandHome />;
};

const BrandHome = () => {
  const { icons } = useApp();
  const { t } = useTranslation();
  const { now } = useNativeNow();
  const { hasPermission, hasAnyOfPermissions } = useCurrentBrandEmployee();

  const bookingsParams = useMemo(
    () => ({
      start: DateHelper.startOfDay(now),
      end: DateHelper.endOfDay(now),
    }),
    [now],
  );

  const { isPending, error } = useBrandBookingLoader(bookingsParams);

  const onLocationsPress = useCallback(() => router.push('/locations'), []);
  const onEmployeesPress = useCallback(() => router.push('/employees'), []);
  const onClientsPress = useCallback(() => router.push('/clients'), []);
  const onServicesPress = useCallback(() => router.push('/services'), []);
  const onPeriodBasedMembershipsPress = useCallback(
    () => router.push(`/memberships/${BrandMembershipType.period}`),
    [],
  );
  const onVisitBasedMembershipsPress = useCallback(
    () => router.push(`/memberships/${BrandMembershipType.visits}`),
    [],
  );
  const onTransactionPress = useCallback(
    () => router.push('/transactions'),
    [],
  );
  const onServiceBookingsPress = useCallback(
    () => router.push(`/bookings/${BrandBookingType.service}`),
    [],
  );
  const onUnavailableBookingsPress = useCallback(
    () => router.push(`/bookings/${BrandBookingType.unavailable}`),
    [],
  );

  return (
    <TabsPageView scrollable withHeaderHeight>
      <FormView gap="$3">
        {/*fixme*/}
        <InitView
          loading={isPending}
          error={error?.message}
          paddingVertical={50}
          noDataIcon="MagicStick"
          noDataMessage="Сьогодні немає запланованих тренувань. Відпочиньте або проведіть час із користю для відновлення!"
        />

        {hasPermission('bookings') && (
          <ListItemGroup title={t('brand.profile.schedule')}>
            <ListItem
              label={t('service_brand_booking.title')}
              icon={<Icon name={icons.ServiceBooking} />}
              onPress={onServiceBookingsPress}
            />
            <ListItem
              label={t('unavailable_brand_booking.title')}
              icon={<Icon name={icons.UnavailableBooking} />}
              onPress={onUnavailableBookingsPress}
            />
          </ListItemGroup>
        )}

        {hasPermission('clients') && (
          <ListItemGroup title={t('brand.profile.stakeholders')}>
            <ListItem
              label={t('brand_client.title')}
              icon={<Icon name="SmileCircle" />}
              onPress={onClientsPress}
            />
          </ListItemGroup>
        )}

        {hasPermission('catalog') && (
          <ListItemGroup title={t('shared.catalog')}>
            <ListItem
              label={t('brand_service.title')}
              icon={<Icon name={icons.Service} />}
              onPress={onServicesPress}
            />
            <ListItem
              label={t(
                `${getTranslateKeyByBrandMembershipType(BrandMembershipType.visits)}.title`,
              )}
              icon={<Icon name={icons.VisitBasedMembership} />}
              onPress={onVisitBasedMembershipsPress}
            />
            <ListItem
              label={t(
                `${getTranslateKeyByBrandMembershipType(BrandMembershipType.period)}.title`,
              )}
              icon={<Icon name={icons.PeriodBasedMembership} />}
              onPress={onPeriodBasedMembershipsPress}
            />
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
          </ListItemGroup>
        )}

        {hasPermission('finances') && (
          <ListItemGroup title={t('brand.profile.finance')}>
            <ListItem
              label={t('brand_transaction.title')}
              icon={<Icon name="Bill" />}
              onPress={onTransactionPress}
            />
          </ListItemGroup>
        )}

        {hasAnyOfPermissions(['employees', 'locations']) && (
          <ListItemGroup title={t('brand.profile.infrastructure')}>
            {hasPermission('locations') && (
              <ListItem
                label={t('brand_location.title')}
                icon={<Icon name="MapPointWave" />}
                onPress={onLocationsPress}
              />
            )}

            {hasPermission('employees') && (
              <ListItem
                label={t('brand_employee.title')}
                icon={<Icon name="UsersGroupRounded" />}
                onPress={onEmployeesPress}
              />
            )}
          </ListItemGroup>
        )}
      </FormView>
    </TabsPageView>
  );
};
