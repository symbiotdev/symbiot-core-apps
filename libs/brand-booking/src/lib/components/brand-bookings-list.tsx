import {
  Button,
  compactViewStyles,
  defaultPageHorizontalPadding,
  EmptyView,
  InitView,
  RegularText,
  SectionList,
  useScreenHeaderHeight,
} from '@symbiot-core-apps/ui';
import {
  BrandBookingType,
  useBrandBookingCurrentListReq,
} from '@symbiot-core-apps/api';
import React, { useCallback, useMemo } from 'react';
import { DateHelper, useI18n } from '@symbiot-core-apps/shared';
import {
  useCurrentAccountPreferences,
  useCurrentBrandEmployee,
} from '@symbiot-core-apps/state';
import { BrandBookingItem } from '@symbiot-core-apps/brand';
import { router } from 'expo-router';
import { useBookingDatetime } from '../hooks/use-booking-datetime';
import { useAppSettings } from '@symbiot-core-apps/app';

export const BrandBookingsList = () => {
  const { timezone } = useBookingDatetime();
  const headerHeight = useScreenHeaderHeight();
  const {
    items: bookings,
    isFetchingNextPage,
    isManualRefetching,
    isLoading,
    error,
    onRefresh,
    onEndReached,
  } = useBrandBookingCurrentListReq({
    start: DateHelper.startOfDay(new Date()),
  });
  const preferences = useCurrentAccountPreferences();

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
            title: DateHelper.format(start, preferences.dateFormat),
            data: bookings?.filter((booking) =>
              DateHelper.isSameDay(start, booking.start),
            ),
          };
        }) || []
      );
    }
  }, [bookings, preferences.dateFormat]);

  const ListEmptyComponent = useCallback(
    () => <Intro loading={isLoading} error={error} />,
    [error, isLoading],
  );

  return (
    <SectionList
      keyboardDismissMode="on-drag"
      refreshing={isManualRefetching}
      expanding={isFetchingNextPage}
      sections={sections}
      progressViewOffset={headerHeight}
      style={{
        paddingTop: headerHeight,
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
          style={compactViewStyles}
          textAlign="center"
          paddingVertical="$2"
        >
          {section.title}
        </RegularText>
      )}
      renderItem={({ item }) => (
        <BrandBookingItem
          alignSelf="center"
          borderRadius="$10"
          padding="$4"
          cursor="pointer"
          booking={item}
          timezone={timezone}
          style={compactViewStyles}
          pressStyle={{ opacity: 0.8 }}
          onPress={() =>
            router.push(`/bookings/${item.type}/${item.id}/profile`)
          }
        />
      )}
      onRefresh={onRefresh}
      onEndReached={onEndReached}
    />
  );
};

const Intro = ({
  loading,
  error,
}: {
  loading: boolean;
  error?: string | null;
}) => {
  const { icons } = useAppSettings();
  const { t } = useI18n();
  const { hasPermission } = useCurrentBrandEmployee();

  if (loading || error) {
    return <InitView loading={loading} error={error} />;
  } else {
    return (
      <EmptyView
        padding={0}
        iconName={icons.ServiceBooking}
        title={t(`brand_booking.empty.title`)}
        message={t(`brand_booking.empty.subtitle`)}
      >
        {hasPermission('bookings') && (
          <Button
            label={t(`brand_booking.empty.button.label`)}
            onPress={() =>
              router.push(`/bookings/${BrandBookingType.service}/create`)
            }
          />
        )}
      </EmptyView>
    );
  }
};
