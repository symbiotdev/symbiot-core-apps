import {
  AnimatedList,
  defaultPageHorizontalPadding,
} from '@symbiot-core-apps/ui';
import {
  AnyBrandBooking,
  BrandBookingType,
  InfiniteQuery,
  PaginationListParams,
} from '@symbiot-core-apps/api';
import React, { ComponentType, ReactElement, useCallback } from 'react';

export const BrandBookingsList = ({
  type,
  query,
  offsetTop,
  renderItem,
  Intro,
}: {
  type: BrandBookingType;
  offsetTop?: number;
  query: (params?: PaginationListParams) => InfiniteQuery<AnyBrandBooking>;
  renderItem: (props: { item: AnyBrandBooking }) => ReactElement;
  Intro: ComponentType<{ loading?: boolean; error?: string | null }>;
}) => {
  const {
    items: bookings,
    isFetchingNextPage,
    isRefetching,
    isLoading,
    error,
    onRefresh,
    onEndReached,
  } = query();

  const ListEmptyComponent = useCallback(
    () => <Intro loading={isLoading} error={error} />,
    [Intro, error, isLoading],
  );

  return (
    <AnimatedList
      keyboardDismissMode="on-drag"
      refreshing={isRefetching && !isLoading}
      expanding={isFetchingNextPage}
      data={bookings}
      progressViewOffset={offsetTop}
      contentContainerStyle={{
        gap: 4,
        paddingTop: offsetTop,
        paddingHorizontal: defaultPageHorizontalPadding,
      }}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={ListEmptyComponent}
      renderItem={renderItem}
      onRefresh={onRefresh}
      onEndReached={onEndReached}
    />
  );
};
