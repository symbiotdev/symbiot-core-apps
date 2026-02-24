import {
  ActionCard,
  Avatar,
  CardsGrid,
  CompactView,
  H2,
  H3,
  H4,
  QrCodeModal,
  RegularText,
} from '@symbiot-core-apps/ui';
import {
  useCurrentAccountState,
  useCurrentBrandEmployee,
  useCurrentBrandState,
} from '@symbiot-core-apps/state';
import { router, useNavigation } from 'expo-router';
import React, { useCallback, useLayoutEffect, useState } from 'react';
import { useAppSettings } from '@symbiot-core-apps/app';
import { View, XStack } from 'tamagui';
import { emitHaptic, useI18n } from '@symbiot-core-apps/shared';
import {
  BrandMembershipType,
  getTranslateKeyByBrandMembershipType,
} from '@symbiot-core-apps/api';
import { TodayBrandBookings } from '@symbiot-core-apps/brand-booking';
import { BrandCongrats, MyBrandsSelectionList } from '@symbiot-core-apps/brand';
import {
  HEADER_BUTTON_SIZE,
  HeaderButton,
  Icon,
  PAGE_STYLE,
  ScrollablePage,
  useSideMenu,
} from '@symbiot-core-apps/ui2';

const InitialAction = () => {
  const { me } = useCurrentAccountState();
  const { brands: currentBrands } = useCurrentBrandState();
  const { t } = useI18n();
  const { icons } = useAppSettings();
  const navigation = useNavigation();

  const [qrCodeVisible, setQrCodeVisible] = useState(false);

  const createBrand = useCallback(() => router.push('/brand/create'), []);

  const onOpenQrCodeModal = useCallback(() => {
    emitHaptic();
    setQrCodeVisible(true);
  }, []);
  const onCloseQrCodeModal = useCallback(() => {
    emitHaptic();
    setQrCodeVisible(false);
  }, []);

  useLayoutEffect(() => {
    if (!me?.firstname) return;

    navigation.setOptions({
      headerTitle: t('shared.greeting_firstname', {
        firstname: me.firstname,
      }),
    });
  }, [me?.firstname, navigation, t]);

  return (
    <>
      <ScrollablePage
        style={{
          alignItems: 'center',
          gap: PAGE_STYLE.paddingVertical,
          paddingBottom: 100,
        }}
      >
        {currentBrands?.length ? (
          <MyBrandsSelectionList />
        ) : (
          <CompactView gap="$6" marginVertical="auto">
            <View gap="$2">
              <H2 textAlign="center">{t('initial_actions.title')}</H2>
              <RegularText textAlign="center">
                {t('initial_actions.subtitle')}
              </RegularText>
            </View>

            <ActionCard
              title={t('initial_actions.create_workspace.title')}
              subtitle={t('initial_actions.create_workspace.subtitle')}
              buttonLabel={t('initial_actions.create_workspace.button.label')}
              buttonIcon={<Icon name={icons.Workspace} />}
              onPress={createBrand}
            />

            <H4 textAlign="center">{t('shared.or')}</H4>

            <ActionCard
              title={t('initial_actions.join_workspace.title')}
              subtitle={t('initial_actions.join_workspace.subtitle')}
              buttonLabel={t('initial_actions.join_workspace.button.label')}
              buttonIcon={<Icon name="QrCode" />}
              onPress={onOpenQrCodeModal}
            />
          </CompactView>
        )}
      </ScrollablePage>

      {me && (
        <QrCodeModal
          visible={qrCodeVisible}
          qrValue={me.id}
          title={`ID: ${me.id}`}
          qrContent={<RegularText fontSize={30}>🤩</RegularText>}
          onClose={onCloseQrCodeModal}
        />
      )}
    </>
  );
};

const BrandHome = () => {
  const { icons } = useAppSettings();
  const { t } = useI18n();
  const { brand: currentBrand } = useCurrentBrandState();
  const { hasPermission, hasAnyOfPermissions } = useCurrentBrandEmployee();
  const navigation = useNavigation();

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

  useLayoutEffect(() => {
    if (!currentBrand) return;

    navigation.setOptions({
      headerTitle: () => (
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
          <H3 lineHeight={HEADER_BUTTON_SIZE} numberOfLines={1}>
            {currentBrand.name}
          </H3>
        </XStack>
      ),
    });
  }, [currentBrand, navigation]);

  return (
    <ScrollablePage style={{ paddingBottom: 100 }}>
      <CompactView gap="$3">
        {!!currentBrand && <BrandCongrats brand={currentBrand} />}

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
                hidden: !hasPermission('locations'),
                iconName: 'MapPointWave',
                label: t('brand_location.title'),
                // text: used?.locations,
                onPress: onLocationsPress,
              },
              {
                hidden: !hasPermission('employees'),
                iconName: 'UsersGroupRounded',
                label: t('brand_employee.title'),
                // text: used?.employees,
                onPress: onEmployeesPress,
              },
              {
                hidden: !hasPermission('clients'),
                iconName: 'SmileCircle',
                label: t('brand_client.title'),
                // text: used?.clients,
                onPress: onClientsPress,
              },
              {
                hidden: !hasPermission('catalog'),
                iconName: icons.Service,
                label: t('brand_service.title'),
                // text: used?.services,
                onPress: onServicesPress,
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
                text: t('brand_visit_based_membership.subtitle'),
                onPress: onVisitBasedMembershipsPress,
              },
              {
                iconName: icons.PeriodBasedMembership,
                label: t(
                  `${getTranslateKeyByBrandMembershipType(BrandMembershipType.period)}.title`,
                ),
                text: t('brand_period_based_membership.subtitle'),
                onPress: onPeriodBasedMembershipsPress,
              },
              // {
              //   disabled: true,
              //   iconName: 'Gift',
              //   label: t('brand_gift_card.title'),
              //   text: t('shared.coming_soon'),
              // },
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
      </CompactView>
    </ScrollablePage>
  );
};

export default () => {
  const { stats } = useCurrentAccountState();
  const { brand: currentBrand } = useCurrentBrandState();
  const { icons } = useAppSettings();
  const { visible: sideMenuVisible } = useSideMenu();
  const navigation = useNavigation();

  const headerRight = useCallback(
    () =>
      !sideMenuVisible && (
        <HeaderButton
          attention={!!stats.newNotifications}
          iconName={icons.Notifications}
          onPress={() => router.push('/notifications')}
        />
      ),
    [sideMenuVisible, icons.Notifications, stats.newNotifications],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight,
    });
  }, [headerRight, navigation]);

  if (!currentBrand) {
    return <InitialAction />;
  }

  return <BrandHome />;
};
