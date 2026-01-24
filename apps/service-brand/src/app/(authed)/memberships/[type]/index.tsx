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
import { useAppSettings } from '@symbiot-core-apps/app';
import { useAccountLimits } from '@symbiot-core-apps/account-subscription';
import { useI18n } from '@symbiot-core-apps/shared';

export default () => {
  const { t } = useI18n();
  const navigation = useNavigation();
  const headerHeight = useScreenHeaderHeight();
  const { tryAction, getMembershipDetails } = useAccountLimits();
  const { type } = useLocalSearchParams<{
    type: BrandMembershipType;
  }>();
  const { icons } = useAppSettings();

  const limitDetails = useMemo(
    () => getMembershipDetails(type),
    [type, getMembershipDetails],
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
              <Button
                label={t(`${tPrefix}.button.label`)}
                onPress={tryAction(limitDetails.limitAction, () =>
                  router.push(`/memberships/${type}/create`),
                )}
              />
            </EmptyView>
          </PageView>
        );
      }
    },
    [
      t,
      type,
      limitDetails.limitAction,
      icons.PeriodBasedMembership,
      icons.VisitBasedMembership,
      tryAction,
    ],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <HeaderTitle
          title={t(`${getTranslateKeyByBrandMembershipType(type)}.title`)}
          subtitle={limitDetails.used}
        />
      ),
      headerRight: () => (
        <HeaderButton
          iconName="AddCircle"
          onPress={tryAction(limitDetails.limitAction, () =>
            router.push(`/memberships/${type}/create`),
          )}
        />
      ),
    });
  }, [
    t,
    type,
    navigation,
    limitDetails.used,
    limitDetails.limitAction,
    tryAction,
  ]);

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
          onPress={() => router.push(`/memberships/${item.id}/profile`)}
        />
      )}
      Intro={Intro}
    />
  );
};
