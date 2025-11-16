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
  ButtonIcon,
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
import {
  BrandBookingsCalendar,
  useBrandBookingLoader,
} from '@symbiot-core-apps/brand-booking';
import {
  useCurrentBrandBookingsState,
  useCurrentBrandEmployee,
} from '@symbiot-core-apps/state';
import { useCurrentBrandLocationsReq } from '@symbiot-core-apps/api';
import { Platform } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useAllBrandLocation } from '@symbiot-core-apps/brand';

const today = new Date();

export default () => {
  const { i18n } = useTranslation();
  const { now } = useNativeNow();
  const route = useRoute();
  const headerHeight = useScreenHeaderHeight();
  const bottomTabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation();
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
        allLocations,
        ...locations.items.map(({ id, name }) => ({
          label: name,
          value: id,
        })),
      ],
    [allLocations, locations],
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

        <H3
          textTransform="capitalize"
          flex={1}
          numberOfLines={1}
          lineHeight={defaultIconSize}
        >
          {DateHelper.format(selectedDate, 'LLLL yyyy', i18n.language)}
        </H3>
      </XStack>
    ),
    [i18n.language, now, selectedDate],
  );

  const headerRight = useCallback(
    () =>
      locations &&
      hasPermission('locations') && (
        <AdaptivePopover
          ignoreScroll
          ref={popoverRef}
          minWidth={200}
          trigger={
            location ? (
              <Avatar
                cursor="pointer"
                pressStyle={{ opacity: 0.8 }}
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
        >
          <Picker
            moveSelectedToTop
            value={location?.id || allLocations.value}
            options={locationsOptions}
            optionsLoading={locationsLoading}
            optionsError={locationsError}
            onChange={(selectedId) => {
              Platform.OS !== 'ios' && popoverRef.current?.close();

              setLocation(
                locations?.items.find(({ id }) => selectedId === id) ||
                  allLocations.value,
              );
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
      offsetBottom={bottomTabBarHeight}
      selectedDate={selectedDate}
      onChangeSelectedDate={setSelectedDate}
    />
  );
};
