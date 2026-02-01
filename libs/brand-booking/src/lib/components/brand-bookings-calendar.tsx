import { View } from 'tamagui';
import { Ref, useCallback, useMemo } from 'react';
import {
  TimeGridEvent,
  TimeGridRef,
  TimeGridRenderProps,
  TimeGridUnavailableTime,
} from '@symbiot.dev/react-native-timegrid-pro';
import { Calendar, RegularText } from '@symbiot-core-apps/ui';
import { Platform } from 'react-native';
import {
  useCurrentAccountPreferences,
  useCurrentBrandBookingsState,
  useCurrentBrandEmployee,
} from '@symbiot-core-apps/state';
import {
  AnyBrandBooking,
  BrandBookingType,
  getBrandBookingType,
  useUpdateServiceBrandBookingReq,
  useUpdateUnavailableBrandBookingReq,
} from '@symbiot-core-apps/api';
import {
  DateHelper,
  DeviceInfo,
  emitHaptic,
  minutesInDay,
  useScreenOrientation,
  useScreenSize,
} from '@symbiot-core-apps/shared';
import { BrandBookingItem } from '@symbiot-core-apps/brand';
import { router } from 'expo-router';
import { getTimezone } from 'countries-and-timezones';
import { useBookingDatetime } from '../hooks/use-booking-datetime';
import { DeviceType } from 'expo-device';
import { Orientation } from 'expo-screen-orientation';

export const BrandBookingsCalendar = ({
  offsetTop,
  isFetching,
  offsetBottom,
  timeGridRef,
  selectedDate,
  onChangeSelectedDate,
}: {
  offsetTop?: number;
  isFetching?: boolean;
  offsetBottom?: number;
  timeGridRef?: Ref<TimeGridRef>;
  selectedDate: Date;
  onChangeSelectedDate: (date: Date) => void;
}) => {
  const { media } = useScreenSize();
  const { timezone } = useBookingDatetime();
  const { orientation } = useScreenOrientation();
  const preferences = useCurrentAccountPreferences();
  const { hasPermission } = useCurrentBrandEmployee();
  const { currentEmployee } = useCurrentBrandEmployee();
  const { location, bookings } = useCurrentBrandBookingsState();
  const {
    mutateAsync: updateUnavailableBooking,
    isPending: unavailableBookingUpdating,
  } = useUpdateUnavailableBrandBookingReq();
  const {
    mutateAsync: updateServiceBooking,
    isPending: serviceBookingUpdating,
  } = useUpdateServiceBrandBookingReq();

  const numberOfDays = useMemo(() => {
    const countDays = preferences.appearance?.calendar?.countDays;
    const supportPortrait =
      DeviceInfo.deviceType === DeviceType.PHONE &&
      (orientation === Orientation.PORTRAIT_UP ||
        orientation === Orientation.PORTRAIT_DOWN);

    if (supportPortrait) {
      return countDays?.portrait || 3;
    } else {
      if (countDays?.landscape) {
        return countDays.landscape;
      } else if (['sm', 'md', 'lg', 'xl'].includes(media)) {
        return 7;
      } else if (media === 'xs') {
        return 3;
      } else {
        return 1;
      }
    }
  }, [preferences.appearance?.calendar?.countDays, media, orientation]);

  const events: TimeGridEvent[] = useMemo(
    () =>
      bookings
        ?.filter(
          ({ locations, employees, cancelAt }) =>
            !cancelAt &&
            (currentEmployee?.permissions?.bookings ||
              employees.some(({ id }) => id === currentEmployee?.id)) &&
            (!location ||
              !locations?.length ||
              locations?.some(({ id }) => id === location.id)),
        )
        ?.map((booking) => ({
          ...booking,
          timezone,
          text: booking.name,
        })) || [],
    [
      bookings,
      location,
      timezone,
      currentEmployee?.id,
      currentEmployee?.permissions?.bookings,
    ],
  );

  const unavailableTime = useMemo(
    () =>
      location?.schedules?.flatMap(
        ({ day, start, end }) =>
          [
            {
              weekday: day,
              from: 0,
              to: start,
            },
            {
              weekday: day,
              from: DateHelper.isAllDay(start, end) ? minutesInDay : end,
              to: minutesInDay,
            },
          ] as TimeGridUnavailableTime[],
      ),
    [location?.schedules],
  );

  const renderHeaderSafeArea = useCallback(() => {
    return (
      <View flex={1} justifyContent="center" alignItems="center" gap="$1">
        <RegularText color="$calendarTimeColor" fontSize={12}>
          {getTimezone(timezone)?.utcOffsetStr}
        </RegularText>
      </View>
    );
  }, [timezone]);

  const renderEvent = useCallback(
    ({ event }: { event: TimeGridEvent & AnyBrandBooking }) => (
      <BrandBookingItem
        paddingVertical="$1"
        paddingHorizontal="$2"
        gap="$1"
        borderRadius={10}
        booking={event}
      />
    ),
    [],
  );

  const renderAllDayEvent = useCallback(
    ({ event }: { event: TimeGridEvent & AnyBrandBooking }) => (
      <BrandBookingItem
        hideSchedule
        hideCancelledText
        paddingVertical="$1"
        paddingHorizontal="$2"
        gap="$1"
        borderRadius={10}
        nameProps={{
          fontSize: 12,
          minHeight: 12,
        }}
        booking={event}
      />
    ),
    [],
  );

  const onEventUpdated = useCallback(
    async ({ event }: { event: TimeGridEvent }) => {
      const type = getBrandBookingType(event as AnyBrandBooking);

      if (type === BrandBookingType.unavailable) {
        await updateUnavailableBooking({
          id: event.id,
          data: {
            start: event.start as Date,
          },
        });

        return true;
      } else if (type === BrandBookingType.service) {
        await updateServiceBooking({
          id: event.id,
          data: {
            start: event.start as Date,
          },
        });

        return true;
      } else {
        return false;
      }
    },
    [updateServiceBooking, updateUnavailableBooking],
  );

  const onEventPress = useCallback(({ event }: { event: TimeGridEvent }) => {
    emitHaptic();

    router.push(
      `/bookings/${getBrandBookingType(event as AnyBrandBooking)}/${event.id}/profile`,
    );
  }, []);

  return (
    <View flex={1} marginTop={offsetTop}>
      <Calendar
        debounceable
        loading={
          isFetching || unavailableBookingUpdating || serviceBookingUpdating
        }
        timeGridRef={timeGridRef}
        startDate={selectedDate}
        numberOfDays={numberOfDays}
        events={events}
        draggable={hasPermission('bookings')}
        timelineTextFormat={preferences.timeFormat}
        weekStartsOn={preferences.appearance?.calendar?.weekStartsOn}
        hiddenDays={preferences.appearance?.calendar?.hiddenDays}
        unavailableTime={unavailableTime}
        timezone={timezone}
        eventBorderRadius={10}
        allDayEventHeight={40}
        gridBottomOffset={Platform.OS === 'android' ? 5 : offsetBottom}
        renderEvent={renderEvent as TimeGridRenderProps['renderEvent']}
        renderAllDayEvent={
          renderAllDayEvent as TimeGridRenderProps['renderAllDayEvent']
        }
        renderHeaderSafeArea={
          timezone !== DateHelper.currentTimezone()
            ? renderHeaderSafeArea
            : undefined
        }
        onEventPress={onEventPress}
        onEventUpdated={onEventUpdated}
        onChangeDate={onChangeSelectedDate}
      />
    </View>
  );
};
