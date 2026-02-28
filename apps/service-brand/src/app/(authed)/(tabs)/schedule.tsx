import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TimeGridRef } from '@symbiot.dev/react-native-timegrid-pro';
import { router, useNavigation } from 'expo-router';
import {
  DateHelper,
  emitHaptic,
  eventEmitter,
  isIos,
  useI18n,
  useNativeNow,
} from '@symbiot-core-apps/shared';
import { Avatar, ButtonIcon, MediumText } from '@symbiot-core-apps/ui';
import { View } from 'tamagui';
import {
  BrandBookingsCalendar,
  useBrandBookingLoader,
} from '@symbiot-core-apps/brand-booking';
import {
  useCurrentBrandBookingsState,
  useCurrentBrandEmployee,
  useCurrentBrandState,
} from '@symbiot-core-apps/state';
import { useCurrentBrandLocationsReq } from '@symbiot-core-apps/api';
import { useRoute } from '@react-navigation/native';
import { useAllBrandLocation } from '@symbiot-core-apps/brand';
import { DatePicker, Select } from '@symbiot-core-apps/form-controller';
import {
  AdaptiveSheetRef,
  HEADER_BUTTON_SIZE,
  HeaderTitle,
  Icon,
  useHeaderHeight,
} from '@symbiot-core-apps/ui2';

const today = new Date();

export default () => {
  const { lang } = useI18n();
  const { now } = useNativeNow();
  const route = useRoute();
  const headerHeight = useHeaderHeight();
  const navigation = useNavigation();
  const { brand } = useCurrentBrandState();
  const { location, setLocation } = useCurrentBrandBookingsState();
  const { hasPermission } = useCurrentBrandEmployee();
  const allLocations = useAllBrandLocation();

  const sheetRef = useRef<AdaptiveSheetRef>(null);
  const timeGridRef = useRef<TimeGridRef>(null);

  const [selectedDate, setSelectedDate] = useState<Date>(today);

  const {
    items: locations,
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
    }),
    [selectedDate],
  );

  const { refetch, isFetching } = useBrandBookingLoader(bookingsParams);

  const locationsOptions = useMemo(
    () =>
      locations && [
        {
          ...allLocations,
          icon: (
            <Avatar
              name={brand?.name || '*'}
              size={40}
              color={brand?.avatarColor}
              url={brand?.avatar?.xsUrl}
            />
          ),
        },
        ...locations.map(({ id, name, avatar, address }) => ({
          label: name,
          value: id,
          description: address,
          icon: (
            <Avatar
              name={name}
              size={40}
              url={avatar?.xsUrl || brand?.avatar?.xsUrl}
              color={brand?.avatarColor}
            />
          ),
        })),
      ],
    [
      allLocations,
      locations,
      brand?.name,
      brand?.avatar?.xsUrl,
      brand?.avatarColor,
    ],
  );

  const headerTitle = useCallback(() => {
    const date = DateHelper.format(selectedDate, 'LLLL yyyy', lang);

    return (
      <DatePicker
        forceElement="calendar"
        value={selectedDate}
        trigger={
          <HeaderTitle
            title={date}
            subtitle={
              locations?.length ? location?.name || allLocations.label : ''
            }
          />
        }
        onChange={(date) => {
          if (!date) return;

          setSelectedDate(date);
          timeGridRef.current?.toDatetime(date, {
            animated: true,
            ignoreTime: true,
          });
        }}
      />
    );
  }, [
    selectedDate,
    lang,
    allLocations.label,
    location?.name,
    locations?.length,
  ]);

  const headerLeft = useCallback(
    () =>
      locations &&
      locations.length > 1 &&
      hasPermission('locations') && (
        <Select
          searchable
          value={location?.id || allLocations.value}
          options={locationsOptions}
          optionsLoading={locationsLoading}
          optionsError={locationsError}
          trigger={
            <View
              width={40}
              height={40}
              justifyContent="center"
              alignItems="center"
            >
              {location ? (
                <Avatar
                  cursor="pointer"
                  name={location?.name || allLocations.label}
                  size={HEADER_BUTTON_SIZE}
                  url={location?.avatar?.xsUrl}
                  color={brand?.avatarColor}
                />
              ) : (
                <ButtonIcon
                  type="clear"
                  iconSize={HEADER_BUTTON_SIZE}
                  iconName="MapPointWave"
                />
              )}
            </View>
          }
          onChange={(selectedId) => {
            !isIos && sheetRef.current?.hide();

            setLocation(
              locations?.find(({ id }) => selectedId === id) ||
                allLocations.value,
            );
          }}
        />
      ),
    [
      locations,
      locationsError,
      locationsLoading,
      locationsOptions,
      location,
      setLocation,
      allLocations,
      brand?.avatarColor,
      hasPermission,
    ],
  );

  const headerRight = useCallback(
    () => (
      <View
        position="relative"
        alignItems="center"
        justifyContent="center"
        width={40}
        height={40}
        onPress={() => {
          emitHaptic();
          router.push('/bookings');
        }}
      >
        <Icon name="CalendarMinimalistic" />

        <MediumText
          position="absolute"
          bottom={11}
          color="$buttonTextColor1"
          fontSize={10}
          lineHeight={10}
        >
          {now.getDate()}
        </MediumText>
      </View>
    ),
    [now],
  );

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerLeft,
      headerTitle,
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
  }, [
    headerLeft,
    headerTitle,
    headerRight,
    navigation,
    route,
    refetch,
    isFetching,
  ]);

  return (
    <BrandBookingsCalendar
      timeGridRef={timeGridRef}
      isFetching={isFetching || locationsLoading}
      offsetTop={headerHeight}
      offsetBottom={100}
      selectedDate={selectedDate}
      onChangeSelectedDate={setSelectedDate}
    />
  );
};
