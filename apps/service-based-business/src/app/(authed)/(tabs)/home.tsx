import {
  Avatar,
  EmptyView,
  FormView,
  H3,
  HeaderButton,
  headerButtonSize,
  Icon,
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
import React, { useCallback, useLayoutEffect } from 'react';
import { useApp } from '@symbiot-core-apps/app';
import { useTranslation } from 'react-i18next';
import { View, XStack } from 'tamagui';
import { emitHaptic } from '@symbiot-core-apps/shared';
import {
  BrandMembershipType,
  getTranslateKeyByBrandMembershipType,
} from '@symbiot-core-apps/api';

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
  const { hasPermission, hasAnyOfPermissions } = useCurrentBrandEmployee();

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
        <EmptyView
          paddingVertical={50}
          iconName="MagicStick"
          message="Сьогодні немає запланованих тренувань. Відпочиньте або проведіть час із користю для відновлення!"
        />

        {hasPermission('clientsAll') && (
          <ListItemGroup title={t('brand.profile.stakeholders')}>
            <ListItem
              label={t('brand_client.title')}
              icon={<Icon name="SmileCircle" />}
              onPress={onClientsPress}
            />
          </ListItemGroup>
        )}

        {hasPermission('catalogAll') && (
          <ListItemGroup title={t('shared.catalog')}>
            <ListItem
              label={t('brand_service.title')}
              icon={<Icon name={icons.Service} />}
              onPress={onServicesPress}
            />
            <ListItem
              label={t(
                `${getTranslateKeyByBrandMembershipType(BrandMembershipType.period)}.title`,
              )}
              icon={<Icon name={icons.PeriodBasedMembership} />}
              onPress={onPeriodBasedMembershipsPress}
            />
            <ListItem
              label={t(
                `${getTranslateKeyByBrandMembershipType(BrandMembershipType.visits)}.title`,
              )}
              icon={<Icon name={icons.VisitBasedMembership} />}
              onPress={onVisitBasedMembershipsPress}
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

        {hasAnyOfPermissions(['financesAll']) && (
          <ListItemGroup title={t('brand.profile.finance')}>
            <ListItem
              label={t('brand_transaction.title')}
              icon={<Icon name="Bill" />}
              onPress={onTransactionPress}
            />
          </ListItemGroup>
        )}

        {hasAnyOfPermissions(['employeesAll', 'locationsAll']) && (
          <ListItemGroup title={t('brand.profile.infrastructure')}>
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
    </TabsPageView>
  );
};
