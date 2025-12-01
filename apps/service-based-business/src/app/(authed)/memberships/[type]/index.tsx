import { BrandMembershipsCurrentList } from '@symbiot-core-apps/brand-membership';
import React, { useCallback, useLayoutEffect, useMemo } from 'react';
import {
  Button,
  EmptyView,
  HeaderButton,
  HeaderTitle,
  InitView,
  PageView,
  useScreenHeaderHeight,
} from '@symbiot-core-apps/ui';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import {
  BrandMembershipType,
  getTranslateKeyByBrandMembershipType,
  useBrandPeriodBasedMembershipCurrentListReq,
  useBrandVisitBasedMembershipCurrentListReq,
} from '@symbiot-core-apps/api';
import { BrandMembershipItem } from '@symbiot-core-apps/brand';
import { useTranslation } from 'react-i18next';
import { useApp } from '@symbiot-core-apps/app';
import { useAccountLimits } from '@symbiot-core-apps/account-subscription';

export default () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const headerHeight = useScreenHeaderHeight();
  const { canDo, used } = useAccountLimits();
  const { type } = useLocalSearchParams<{
    type: BrandMembershipType;
  }>();
  const { icons } = useApp();

  const config = useMemo(
    () =>
      type === BrandMembershipType.visits
        ? {
            canAdd: canDo.addVisitMembership,
            used: used.visitMemberships,
          }
        : {
            canAdd: canDo.addPeriodMembership,
            used: used.periodMemberships,
          },
    [
      canDo.addPeriodMembership,
      canDo.addVisitMembership,
      type,
      used.periodMemberships,
      used.visitMemberships,
    ],
  );

  const Intro = useCallback(
    ({ loading, error }: { loading?: boolean; error?: string | null }) => {
      if (loading || error) {
        return <InitView loading={loading} error={error} />;
      } else {
        const tPrefix = `${getTranslateKeyByBrandMembershipType(type)}.create.intro`;

        return (
          <PageView
            scrollable
            animation="medium"
            opacity={1}
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          >
            <EmptyView
              padding={0}
              iconName={
                type === BrandMembershipType.period
                  ? icons.PeriodBasedMembership
                  : icons.VisitBasedMembership
              }
              title={t(`${tPrefix}.title`)}
              message={t(`${tPrefix}.subtitle`)}
            >
              {config.canAdd && (
                <Button
                  label={t(`${tPrefix}.button.label`)}
                  onPress={() => router.push(`/memberships/${type}/create`)}
                />
              )}
            </EmptyView>
          </PageView>
        );
      }
    },
    [
      config.canAdd,
      icons.PeriodBasedMembership,
      icons.VisitBasedMembership,
      t,
      type,
    ],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <HeaderTitle
          title={t(`${getTranslateKeyByBrandMembershipType(type)}.title`)}
          subtitle={config.used}
        />
      ),
      headerRight: () =>
        config.canAdd && (
          <HeaderButton
            iconName="AddCircle"
            onPress={() => router.push(`/memberships/${type}/create`)}
          />
        ),
    });
  }, [config.canAdd, config.used, navigation, t, type]);

  return (
    <BrandMembershipsCurrentList
      type={type}
      offsetTop={headerHeight}
      query={
        type === BrandMembershipType.period
          ? useBrandPeriodBasedMembershipCurrentListReq
          : useBrandVisitBasedMembershipCurrentListReq
      }
      renderItem={({ item }) => (
        <BrandMembershipItem
          alignSelf="center"
          membership={item}
          onPress={() => router.push(`/memberships/${type}/${item.id}/profile`)}
        />
      )}
      Intro={Intro}
    />
  );
};
