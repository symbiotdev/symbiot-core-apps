import {
  AnyBrandClientMembership,
  AppConfigIconNameLegacy,
  BrandMembershipType,
  useBrandClientPeriodBasedMembershipsListReq,
  useBrandClientVisitsBasedMembershipsListReq,
} from '@symbiot-core-apps/api';
import React, { ReactElement, useCallback } from 'react';
import {
  AnimatedList,
  ContainerView,
  defaultPageHorizontalPadding,
  defaultPageVerticalPadding,
  InitView,
} from '@symbiot-core-apps/ui';
import { useAppSettings } from '@symbiot-core-apps/app';
import { useI18n } from '@symbiot-core-apps/shared';

const byType = {
  [BrandMembershipType.period]: {
    query: useBrandClientPeriodBasedMembershipsListReq,
    icon: 'PeriodBasedMembership',
    noDataTitle: 'brand_client.history.period_based_memberships.empty.title',
    noDataMessage:
      'brand_client.history.period_based_memberships.empty.subtitle',
  },
  [BrandMembershipType.visits]: {
    query: useBrandClientVisitsBasedMembershipsListReq,
    icon: 'VisitBasedMembership',
    noDataTitle: 'brand_client.history.visit_based_memberships.empty.title',
    noDataMessage:
      'brand_client.history.visit_based_memberships.empty.subtitle',
  },
};

export const BrandClientMembershipsList = ({
  clientId,
  type,
  offsetTop,
  renderItem,
}: {
  clientId: string;
  type: BrandMembershipType;
  offsetTop?: number;
  renderItem: (props: { item: AnyBrandClientMembership }) => ReactElement;
}) => {
  const config = byType[type];
  const { t } = useI18n();
  const { icons } = useAppSettings();

  const {
    items: memberships,
    isFetchingNextPage,
    isManualRefetching,
    isLoading,
    error,
    onRefresh,
    onEndReached,
  } = config.query(clientId);

  const ListEmptyComponent = useCallback(
    () => (
      <InitView
        error={error}
        loading={isLoading}
        noDataIcon={icons[config.icon as AppConfigIconNameLegacy]}
        noDataTitle={t(config.noDataTitle)}
        noDataMessage={t(config.noDataMessage)}
      />
    ),
    [
      config.icon,
      config.noDataMessage,
      config.noDataTitle,
      error,
      icons,
      isLoading,
      t,
    ],
  );

  return (
    <ContainerView flex={1} paddingVertical={defaultPageVerticalPadding}>
      <AnimatedList
        keyboardDismissMode="on-drag"
        refreshing={isManualRefetching}
        expanding={isFetchingNextPage}
        data={memberships}
        progressViewOffset={offsetTop}
        contentContainerStyle={{
          gap: 4,
          paddingTop: offsetTop,
          paddingHorizontal: defaultPageHorizontalPadding,
          paddingBottom: 100,
        }}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={ListEmptyComponent}
        renderItem={renderItem}
        onRefresh={onRefresh}
        onEndReached={onEndReached}
      />
    </ContainerView>
  );
};
