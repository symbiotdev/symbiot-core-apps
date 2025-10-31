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
  useCurrentAccountState,
  useCurrentBrandBookingsState,
  useCurrentBrandEmployee,
} from '@symbiot-core-apps/state';
import { useTranslation } from 'react-i18next';
import {
  AnyBrandBooking,
  BrandLocation,
  getBrandBookingType,
} from '@symbiot-core-apps/api';
import { DateHelper, minutesInDay } from '@symbiot-core-apps/shared';
import { BrandBookingItem } from '@symbiot-core-apps/brand';
import { router } from 'expo-router';

export const BrandBookingsCalendar = ({
  offsetTop,
  isFetching,
  offsetBottom,
  location,
  timeGridRef,
  selectedDate,
  onChangeSelectedDate,
}: {
  offsetTop?: number;
  isFetching?: boolean;
  offsetBottom?: number;
  location?: BrandLocation;
  timeGridRef?: Ref<TimeGridRef>;
  selectedDate: Date;
  onChangeSelectedDate: (date: Date) => void;
}) => {
  const { t } = useTranslation();
  const { me } = useCurrentAccountState();
  const { bookings } = useCurrentBrandBookingsState();
  const { currentEmployee } = useCurrentBrandEmployee();

  const events: TimeGridEvent[] = useMemo(
    () =>
      bookings
        ?.filter(
          ({ locations }) =>
            !location ||
            !locations?.length ||
            locations?.some(({ id }) => id === location.id),
        )
        ?.map((booking) => ({
          ...booking,
          text: booking.name,
        })) || [],
    [bookings, location],
  );

  const schedule = useMemo(
    () => location?.schedules?.find(({ day }) => day === selectedDate.getDay()),
    [location, selectedDate],
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
    if (!schedule) return <View />;

    if (DateHelper.isAllDay(schedule.start, schedule.end)) {
      return (
        <View flex={1} justifyContent="center" alignItems="center" gap="$1">
          <RegularText color="$calendarTimeColor" fontSize={10}>
            {t('shared.schedule.all_day')}
          </RegularText>
        </View>
      );
    } else if (DateHelper.isDayOff(schedule.start, schedule.end)) {
      return (
        <View flex={1} justifyContent="center" alignItems="center" gap="$1">
          <RegularText color="$calendarTimeColor" fontSize={10}>
            {t('shared.schedule.day_off')}
          </RegularText>
        </View>
      );
    } else {
      const startOfDay = DateHelper.startOfDay(new Date());

      return (
        <View flex={1} justifyContent="center" alignItems="center" gap="$1">
          <RegularText fontSize={10}>
            {DateHelper.format(
              DateHelper.addMinutes(startOfDay, schedule.start),
              'p',
            )}
          </RegularText>
          <RegularText fontSize={10}>
            {DateHelper.format(
              DateHelper.addMinutes(startOfDay, schedule.end),
              'p',
            )}
          </RegularText>
        </View>
      );
    }
  }, [schedule, t]);

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

  return (
    <View flex={1} marginTop={offsetTop}>
      <Calendar
        debounceable
        loading={isFetching}
        timeGridRef={timeGridRef}
        startDate={selectedDate}
        events={events}
        draggable={!!currentEmployee?.permissions?.bookings}
        weekStartsOn={me?.preferences?.weekStartsOn}
        unavailableTime={unavailableTime}
        eventBorderRadius={10}
        allDayEventHeight={40}
        gridBottomOffset={Platform.OS === 'android' ? 5 : offsetBottom}
        renderHeaderSafeArea={renderHeaderSafeArea}
        renderEvent={renderEvent as TimeGridRenderProps['renderEvent']}
        renderAllDayEvent={
          renderAllDayEvent as TimeGridRenderProps['renderAllDayEvent']
        }
        onEventPress={({ event }) =>
          router.push(
            `/bookings/${getBrandBookingType(event as AnyBrandBooking)}/${event.id}/profile`,
          )
        }
        onChangeDate={onChangeSelectedDate}
      />
    </View>
  );
};
