import { BrandMembershipsCurrentList } from '@symbiot-core-apps/brand-membership';
import React, { useLayoutEffect } from 'react';
import {
  Button,
  EmptyView,
  HeaderButton,
  InitView,
  PageView,
  useScreenHeaderHeight,
} from '@symbiot-core-apps/ui';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import {
  BrandMembershipType,
  useBrandPeriodBasedMembershipCurrentListQuery,
  useBrandVisitBasedMembershipCurrentListQuery,
} from '@symbiot-core-apps/api';
import { BrandMembershipItem } from '@symbiot-core-apps/brand';
import { useTranslation } from 'react-i18next';
import { useApp } from '@symbiot-core-apps/app';

export default () => {
  const navigation = useNavigation();
  const headerHeight = useScreenHeaderHeight();
  const { type } = useLocalSearchParams<{
    type: BrandMembershipType;
  }>();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButton
          iconName="AddCircle"
          onPress={() => router.push(`/memberships/${type}/create`)}
        />
      ),
    });
  }, [type, navigation]);

  return (
    <BrandMembershipsCurrentList
      offsetTop={headerHeight}
      query={
        type === BrandMembershipType.period
          ? useBrandPeriodBasedMembershipCurrentListQuery
          : useBrandVisitBasedMembershipCurrentListQuery
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

const Intro = ({
  loading,
  error,
}: {
  loading?: boolean;
  error?: string | null;
}) => {
  const { icons } = useApp();
  const { t } = useTranslation();
  const { type } = useLocalSearchParams<{
    type: BrandMembershipType;
  }>();

  const tPrefix =
    type === BrandMembershipType.period
      ? 'brand_period_based_membership.create.intro'
      : 'brand_visit_based_membership.create.intro';

  if (loading || error) {
    return <InitView loading={loading} error={error} />;
  } else {
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
            onPress={() => router.push(`/memberships/${type}/create`)}
          />
        </EmptyView>
      </PageView>
    );
  }
};
