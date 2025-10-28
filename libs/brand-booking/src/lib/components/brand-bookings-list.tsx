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
import { Platform } from 'react-native';

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

  const sections = useMemo(
    () =>
      bookings
        ?.map(({ start }) => DateHelper.startOfDay(start))
        ?.map((start) => ({
          title: DateHelper.format(start, me?.preferences?.dateFormat),
          data: bookings?.filter((booking) =>
            DateHelper.isSameDay(start, booking.start),
          ),
        })) || [],
    [bookings, me?.preferences?.dateFormat],
  );

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
      listLoadingFooterProps={{
        ...(Platform.OS === 'web' && {
          y: offsetTop,
        }),
      }}
      progressViewOffset={offsetTop}
      contentContainerStyle={{
        gap: 4,
        paddingHorizontal: defaultPageHorizontalPadding,
        ...(Platform.OS === 'web'
          ? {
              paddingBottom: offsetTop,
            }
          : {
              marginTop: offsetTop,
            }),
      }}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={ListEmptyComponent}
      renderSectionHeader={({ section }) => (
        <RegularText
          backgroundColor="$background"
          style={formViewStyles}
          textAlign="center"
          paddingVertical="$2"
          y={Platform.OS === 'web' ? offsetTop : undefined}
        >
          {section.title}
        </RegularText>
      )}
      renderItem={({ item }) => (
        <BrandBookingItem
          y={Platform.OS === 'web' ? offsetTop : undefined}
          alignSelf="center"
          booking={item}
          onPress={() => router.push(`/bookings/${type}/${item.id}/profile`)}
        />
      )}
      onRefresh={onRefresh}
      onEndReached={onEndReached}
    />
  );
};
