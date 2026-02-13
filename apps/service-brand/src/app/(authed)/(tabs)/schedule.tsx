import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TimeGridRef } from '@symbiot.dev/react-native-timegrid-pro';
import { useNavigation } from 'expo-router';
import {
  DateHelper,
  eventEmitter,
  isIos,
  useI18n,
  useNativeNow,
} from '@symbiot-core-apps/shared';
import {
  AdaptivePopoverRef,
  Avatar,
  ButtonIcon,
  H3,
  H4,
  headerButtonSize,
  Icon,
  MediumText,
  RegularText,
  tabBarHeight,
  useScreenHeaderHeight,
} from '@symbiot-core-apps/ui';
import { View, XStack } from 'tamagui';
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
import { SmartSelect } from '@symbiot-core-apps/form-controller';

const today = new Date();

export default () => {
  const { lang } = useI18n();
  const { now } = useNativeNow();
  const route = useRoute();
  const headerHeight = useScreenHeaderHeight();
  const navigation = useNavigation();
  const { brand } = useCurrentBrandState();
  const { location, setLocation } = useCurrentBrandBookingsState();
  const { hasPermission } = useCurrentBrandEmployee();
  const allLocations = useAllBrandLocation();

  const popoverRef = useRef<AdaptivePopoverRef>(null);
  const timeGridRef = useRef<TimeGridRef>(null);

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
              url={brand?.avatar?.xsUrl}
            />
          ),
        },
        ...locations.items.map(({ id, name, avatar }) => ({
          label: name,
          value: id,
          icon: (
            <Avatar
              name={name}
              size={40}
              url={avatar?.xsUrl || brand?.avatar?.xsUrl}
            />
          ),
        })),
      ],
    [allLocations, locations, brand?.name, brand?.avatar?.xsUrl],
  );

  const headerLeft = useCallback(() => {
    const date = DateHelper.format(selectedDate, 'LLLL yyyy', lang);

    return (
      <XStack gap="$3" alignItems="center" width="100%" flex={1}>
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

        {locations?.items?.length ? (
          <View flex={1} gap={1} marginTop={3} justifyContent="center">
            <H4 numberOfLines={1}>{date}</H4>

            {!!locations?.items?.length && (
              <RegularText color="$disabled" fontSize={12} numberOfLines={1}>
                {location?.name || allLocations.label}
              </RegularText>
            )}
          </View>
        ) : (
          <H3 numberOfLines={1} marginTop={3}>
            {date}
          </H3>
        )}
      </XStack>
    );
  }, [
    now,
    selectedDate,
    lang,
    allLocations.label,
    location?.name,
    locations?.items?.length,
  ]);

  const headerRight = useCallback(
    () =>
      locations?.items &&
      locations.items.length > 1 &&
      hasPermission('locations') && (
        <SmartSelect
          value={location?.id || allLocations.value}
          options={locationsOptions}
          optionsLoading={locationsLoading}
          optionsError={locationsError}
          trigger={
            location ? (
              <Avatar
                cursor="pointer"
                name={location?.name || allLocations.label}
                size={headerButtonSize}
                url={location?.avatar?.xsUrl}
              />
            ) : (
              <ButtonIcon
                type="clear"
                iconSize={headerButtonSize}
                iconName="MapPointWave"
              />
            )
          }
          onChange={(selectedId) => {
            !isIos && popoverRef.current?.close();

            setLocation(
              locations?.items.find(({ id }) => selectedId === id) ||
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
      hasPermission,
    ],
  );

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

  return (
    <BrandBookingsCalendar
      timeGridRef={timeGridRef}
      isFetching={isFetching || locationsLoading}
      offsetTop={headerHeight}
      offsetBottom={tabBarHeight}
      selectedDate={selectedDate}
      onChangeSelectedDate={setSelectedDate}
    />
  );
};
