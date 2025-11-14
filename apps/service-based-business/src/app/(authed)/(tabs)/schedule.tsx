import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TimeGridRef } from '@symbiot.dev/react-native-timegrid-pro';
import { useNavigation } from 'expo-router';
import {
  DateHelper,
  eventEmitter,
  useNativeNow,
} from '@symbiot-core-apps/shared';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import {
  AdaptivePopover,
  AdaptivePopoverRef,
  Avatar,
  defaultIconSize,
  H3,
  headerButtonSize,
  Icon,
  MediumText,
  Picker,
  useScreenHeaderHeight,
} from '@symbiot-core-apps/ui';
import { View, XStack } from 'tamagui';
import { useTranslation } from 'react-i18next';
import { BrandBookingsCalendar } from '@symbiot-core-apps/brand-booking';
import {
  useCurrentBrandBookingsState,
  useCurrentBrandEmployee,
} from '@symbiot-core-apps/state';
import {
  useBrandBookingPeriodListReq,
  useCurrentBrandLocationsReq,
} from '@symbiot-core-apps/api';
import { Platform } from 'react-native';
import { useRoute } from '@react-navigation/native';

const today = new Date();

export default () => {
  const { i18n } = useTranslation();
  const route = useRoute();
  const { now } = useNativeNow();
  const headerHeight = useScreenHeaderHeight();
  const bottomTabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation();
  const { location, setLocation, syncBookings } =
    useCurrentBrandBookingsState();
  const { currentEmployee, hasPermission } = useCurrentBrandEmployee();

  const popoverRef = useRef<AdaptivePopoverRef>(null);
  const timeGridRef = useRef<TimeGridRef>(null);
  const permissionsRef = useRef(currentEmployee?.permissions?.bookings);
  const bookingParamsRef = useRef({ start: today, end: today });

  const [selectedDate, setSelectedDate] = useState(today);

  const {
    data: locations,
    isFetching: locationsLoading,
    error: locationsError,
  } = useCurrentBrandLocationsReq({
    enabled: false,
  });

  const bookingsParams = useMemo(
    () => ({
      start: DateHelper.startOfDay(
        DateHelper.addDays(DateHelper.startOfMonth(selectedDate), -7),
      ),
      end: DateHelper.endOfDay(
        DateHelper.addDays(DateHelper.endOfMonth(selectedDate), 7),
      ),
      location: location?.id,
    }),
    [location?.id, selectedDate],
  );

  const {
    data: bookings,
    isFetching,
    isFetchedAfterMount,
    refetch,
  } = useBrandBookingPeriodListReq({
    params: bookingsParams,
  });

  const locationsOptions = useMemo(
    () =>
      locations?.items?.map(({ id, name }) => ({
        label: name,
        value: id,
      })),
    [locations],
  );

  const headerLeft = useCallback(
    () => (
      <XStack gap="$3" alignItems="center" width="100%">
        <View position="relative" alignItems="center" justifyContent="center">
          <Icon name="CalendarMinimalistic" color="$buttonTextColor1" />

          <MediumText
            position="absolute"
            bottom={3}
            color="$buttonTextColor1"
            fontSize={10}
            lineHeight={10}
          >
            {now.getDate()}
          </MediumText>
        </View>

        <H3 textTransform="capitalize" flex={1} numberOfLines={1} lineHeight={defaultIconSize}>
          {DateHelper.format(selectedDate, 'LLLL yyyy', i18n.language)}
        </H3>
      </XStack>
    ),
    [i18n.language, now, selectedDate],
  );

  const headerRight = useCallback(
    () =>
      location &&
      hasPermission('locations') && (
        <AdaptivePopover
          ignoreScroll
          ref={popoverRef}
          minWidth={200}
          trigger={
            <Avatar
              cursor="pointer"
              pressStyle={{ opacity: 0.8 }}
              name={location.name}
              size={headerButtonSize}
              url={location.avatar?.xsUrl}
            />
          }
        >
          <Picker
            moveSelectedToTop
            value={location.id}
            options={locationsOptions}
            optionsLoading={locationsLoading}
            optionsError={locationsError}
            onChange={(selectedId) => {
              Platform.OS !== 'ios' && popoverRef.current?.close();

              setLocation(locations?.items.find(({ id }) => selectedId === id));
            }}
          />
        </AdaptivePopover>
      ),
    [
      locations,
      locationsError,
      locationsLoading,
      locationsOptions,
      location,
      setLocation,
      hasPermission,
    ],
  );

  useEffect(() => {
    bookingParamsRef.current = bookingsParams;
  }, [bookingsParams]);

  useEffect(() => {
    if (permissionsRef.current === currentEmployee?.permissions?.bookings)
      return;

    permissionsRef.current = currentEmployee?.permissions?.bookings;

    void refetch();
  }, [currentEmployee?.permissions?.bookings]);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerLeft,
      headerRight,
    });

    const onTabPress = (name: string) => {
      if (route.name === name && navigation.isFocused() && !isFetching) {
        void refetch();

        timeGridRef.current?.toDatetime(new Date(), {
          animated: true,
        });
      }
    };

    eventEmitter.on('tabPress', onTabPress);

    return () => {
      eventEmitter.off('tabPress', onTabPress);
    };
  }, [headerLeft, headerRight, navigation, route, refetch, isFetching]);

  useEffect(() => {
    if (isFetchedAfterMount && bookings && bookings.items?.length) {
      syncBookings({
        bookings: bookings.items,
        start: bookingParamsRef.current.start,
        end: bookingParamsRef.current.end,
      });
    }
  }, [bookings, isFetchedAfterMount, syncBookings]);

  return (
    <BrandBookingsCalendar
      timeGridRef={timeGridRef}
      isFetching={isFetching || locationsLoading}
      location={location}
      offsetTop={headerHeight}
      offsetBottom={bottomTabBarHeight}
      selectedDate={selectedDate}
      onChangeSelectedDate={setSelectedDate}
    />
  );
};
