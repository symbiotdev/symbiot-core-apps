import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TimeGridRef } from '@symbiot.dev/react-native-timegrid-pro';
import { useNavigation } from 'expo-router';
import {
  DateHelper,
  emitHaptic,
  isEqual,
  useNativeNow,
} from '@symbiot-core-apps/shared';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import {
  AdaptivePopover,
  AdaptivePopoverRef,
  Avatar,
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
import { useCurrentBrandBookingsState } from '@symbiot-core-apps/state';
import {
  useBrandBookingPeriodListReq,
  useCurrentBrandLocationsReq,
} from '@symbiot-core-apps/api';
import { Platform } from 'react-native';

export default () => {
  const { i18n } = useTranslation();
  const { now } = useNativeNow();
  const headerHeight = useScreenHeaderHeight();
  const bottomTabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation();
  const { location, setLocation, upsertBookings } =
    useCurrentBrandBookingsState();

  const popoverRef = useRef<AdaptivePopoverRef>(null);
  const timeGridRef = useRef<TimeGridRef>(null);

  const [selectedDate, setSelectedDate] = useState(new Date());

  const {
    data: locations,
    isPending: locationsLoading,
    error: locationsError,
  } = useCurrentBrandLocationsReq();

  const bookingsParams = useMemo(() => {
    return {
      start: DateHelper.addDays(DateHelper.startOfMonth(selectedDate), -7),
      end: DateHelper.addDays(DateHelper.endOfMonth(selectedDate), 7),
      location: location?.id,
    };
  }, [location?.id, selectedDate]);

  const { data: bookings, isFetching } = useBrandBookingPeriodListReq({
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

  const goToday = useCallback(() => {
    timeGridRef.current?.toDatetime(new Date(), {
      animated: true,
    });

    emitHaptic();
  }, []);

  const headerLeft = useCallback(
    () => (
      <XStack gap="$3" alignItems="center" width="100%">
        <View
          position="relative"
          alignItems="center"
          justifyContent="center"
          cursor="pointer"
          pressStyle={{ opacity: 0.8 }}
          onPress={goToday}
        >
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

        <H3 textTransform="capitalize" flex={1} numberOfLines={1}>
          {DateHelper.format(selectedDate, 'LLLL yyyy', i18n.language)}
        </H3>
      </XStack>
    ),
    [i18n.language, now, goToday, selectedDate],
  );

  const headerRight = useCallback(
    () =>
      location && (
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
    ],
  );

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerLeft,
      headerRight,
    });
  }, [headerLeft, headerRight, navigation]);

  useEffect(() => {
    if (
      locations &&
      !locations.items.some((locationItem) => isEqual(locationItem, location))
    ) {
      setLocation(locations.items.length > 1 ? locations.items[0] : undefined);
    }
  }, [location, locations, setLocation]);

  useEffect(() => {
    if (bookings && bookings.items?.length) {
      upsertBookings(bookings.items);
    }
  }, [bookings, upsertBookings]);

  return (
    <BrandBookingsCalendar
      timeGridRef={timeGridRef}
      isFetching={isFetching}
      location={location}
      offsetTop={headerHeight}
      offsetBottom={bottomTabBarHeight}
      selectedDate={selectedDate}
      onChangeSelectedDate={setSelectedDate}
    />
  );
};
