import {
  AnyBrandClientMembership,
  InfiniteQuery,
  PaginationListParams,
} from '@symbiot-core-apps/api';
import React, { ReactElement, useCallback } from 'react';
import {
  AnimatedList,
  ContainerView,
  defaultPageHorizontalPadding,
  defaultPageVerticalPadding,
  InitView,
} from '@symbiot-core-apps/ui';

export const BrandClientMembershipsList = ({
  clientId,
  offsetTop,
  query,
  renderItem,
}: {
  clientId: string;
  offsetTop?: number;
  query: (
    clientId: string,
    props?: {
      params?: PaginationListParams;
    },
  ) => InfiniteQuery<AnyBrandClientMembership>;
  renderItem: (props: { item: AnyBrandClientMembership }) => ReactElement;
}) => {
  const {
    items: memberships,
    isFetchingNextPage,
    isRefetching,
    isLoading,
    error,
    onRefresh,
    onEndReached,
  } = query(clientId);

  const ListEmptyComponent = useCallback(
    () => <InitView loading={isLoading} error={error} />,
    [error, isLoading],
  );

  return (
    <ContainerView flex={1} paddingVertical={defaultPageVerticalPadding}>
      <AnimatedList
        keyboardDismissMode="on-drag"
        refreshing={isRefetching && !isLoading}
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
