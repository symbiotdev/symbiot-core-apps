import {
  Avatar,
  CardsGrid,
  FormView,
  H3,
  HeaderButton,
  headerButtonSize,
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
import React, { useCallback, useLayoutEffect } from 'react';
import { useApp } from '@symbiot-core-apps/app';
import { useTranslation } from 'react-i18next';
import { XStack } from 'tamagui';
import { emitHaptic } from '@symbiot-core-apps/shared';
import {
  BrandMembershipType,
  getTranslateKeyByBrandMembershipType,
} from '@symbiot-core-apps/api';
import { TodayBrandBookings } from '@symbiot-core-apps/brand-booking';
import {
  BrandCongrats,
  BrandProfileCompletion,
} from '@symbiot-core-apps/brand';
import { useAccountLimits } from '@symbiot-core-apps/account-subscription';

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
  const { brand: currentBrand } = useCurrentBrandState();
  const { hasPermission, hasAnyOfPermissions } = useCurrentBrandEmployee();
  const { used } = useAccountLimits();

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

  return (
    <TabsPageView scrollable withHeaderHeight>
      <FormView gap="$3">
        {!!currentBrand && (
          <>
            <BrandCongrats brand={currentBrand} />

            {hasPermission('brand') && (
              <BrandProfileCompletion showAction brand={currentBrand} />
            )}
          </>
        )}

        <TodayBrandBookings />

        {hasAnyOfPermissions([
          'clients',
          'catalog',
          'employees',
          'locations',
        ]) && (
          <CardsGrid
            title={t('brand.profile.assets')}
            items={[
              {
                hidden: !hasPermission('clients'),
                iconName: 'SmileCircle',
                label: t('brand_client.title'),
                text: used?.clients,
                onPress: onClientsPress,
              },
              {
                hidden: !hasPermission('catalog'),
                iconName: icons.Service,
                label: t('brand_service.title'),
                text: used?.services,
                onPress: onServicesPress,
              },
              {
                hidden: !hasPermission('employees'),
                iconName: 'UsersGroupRounded',
                label: t('brand_employee.title'),
                text: used?.employees,
                onPress: onEmployeesPress,
              },
              {
                hidden: !hasPermission('locations'),
                iconName: 'MapPointWave',
                label: t('brand_location.title'),
                text: used?.locations,
                onPress: onLocationsPress,
              },
            ]}
          />
        )}

        {hasPermission('catalog') && (
          <CardsGrid
            title={t('shared.catalog')}
            items={[
              {
                iconName: icons.VisitBasedMembership,
                label: t(
                  `${getTranslateKeyByBrandMembershipType(BrandMembershipType.visits)}.title`,
                ),
                text: used?.visitMemberships,
                onPress: onVisitBasedMembershipsPress,
              },
              {
                iconName: icons.PeriodBasedMembership,
                label: t(
                  `${getTranslateKeyByBrandMembershipType(BrandMembershipType.period)}.title`,
                ),
                text: used?.periodMemberships,
                onPress: onPeriodBasedMembershipsPress,
              },
              {
                disabled: true,
                iconName: 'Gift',
                label: t('brand_gift_card.title'),
                text: t('shared.coming_soon'),
              },
            ]}
          />
        )}

        {hasPermission('finances') && (
          <CardsGrid
            title={t('brand.profile.finance')}
            items={[
              {
                iconName: 'Bill',
                label: t('brand_transaction.title'),
                onPress: onTransactionPress,
              },
            ]}
          />
        )}
      </FormView>
    </TabsPageView>
  );
};
