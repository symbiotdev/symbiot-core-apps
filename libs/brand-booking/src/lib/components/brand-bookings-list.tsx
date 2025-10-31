import {
  defaultPageHorizontalPadding,
  formViewStyles,
  RegularText,
  SectionList,
} from '@symbiot-core-apps/ui';
import {
  AnyBrandBooking,
  BrandBookingType,
  InfiniteQuery,
  PaginationListParams,
} from '@symbiot-core-apps/api';
import React, { ComponentType, useCallback, useMemo } from 'react';
import { DateHelper } from '@symbiot-core-apps/shared';
import { useCurrentAccountState } from '@symbiot-core-apps/state';
import { BrandBookingItem } from '@symbiot-core-apps/brand';
import { router } from 'expo-router';

export const BrandBookingsList = ({
  type,
  query,
  offsetTop,
  Intro,
}: {
  type: BrandBookingType;
  offsetTop?: number;
  query: (params?: PaginationListParams) => InfiniteQuery<AnyBrandBooking>;
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
  const { me } = useCurrentAccountState();

  const sections = useMemo(() => {
    if (!bookings) {
      return [];
    } else {
      return (
        Array.from(
          new Set(
            bookings.map(({ start }) => DateHelper.startOfDay(start).getTime()),
          ),
        ).map((time) => {
          const start = new Date(time);

          return {
            title: DateHelper.format(start, me?.preferences?.dateFormat),
            data: bookings?.filter((booking) =>
              DateHelper.isSameDay(start, booking.start),
            ),
          };
        }) || []
      );
    }
  }, [bookings, me?.preferences?.dateFormat]);

  const ListEmptyComponent = useCallback(
    () => <Intro loading={isLoading} error={error} />,
    [Intro, error, isLoading],
  );

  return (
    <SectionList
      keyboardDismissMode="on-drag"
      refreshing={isRefetching && !isLoading}
      expanding={isFetchingNextPage}
      sections={sections}
      progressViewOffset={offsetTop}
      style={{
        paddingTop: offsetTop,
      }}
      contentContainerStyle={{
        gap: 4,
        paddingHorizontal: defaultPageHorizontalPadding,
      }}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={ListEmptyComponent}
      renderSectionHeader={({ section }) => (
        <RegularText
          backgroundColor="$background"
          style={formViewStyles}
          textAlign="center"
          paddingVertical="$2"
        >
          {section.title}
        </RegularText>
      )}
      renderItem={({ item }) => (
        <BrandBookingItem
          alignSelf="center"
          booking={item}
          borderRadius="$10"
          padding="$4"
          cursor="pointer"
          style={formViewStyles}
          pressStyle={{ opacity: 0.8 }}
          onPress={() => router.push(`/bookings/${type}/${item.id}/profile`)}
        />
      )}
      onRefresh={onRefresh}
      onEndReached={onEndReached}
    />
  );
};
