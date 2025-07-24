import {
  TimeGrid,
  TimeGridActionsProps,
  TimeGridRef,
} from '@symbiot.dev/react-native-timegrid-pro';
import { Platform, useWindowDimensions } from 'react-native';
import { useDateLocale } from '@symbiot-core-apps/i18n';
import { useCallback, useMemo, useRef } from 'react';
import { useTheme, View, XStack } from 'tamagui';
import {
  DateHelper,
  DeviceInfo,
  useNativeNow,
  useScreenOrientation,
  useScreenSize,
} from '@symbiot-core-apps/shared';
import { MediumText, RegularText } from '../text/text';
import { H3 } from '../text/heading';
import { Orientation } from 'expo-screen-orientation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DeviceType } from 'expo-device';
import { Day } from 'date-fns/types';

const snappable = Platform.OS !== 'web';

export const Calendar = ({
  selectedDate,
  gridBottomOffset = 0,
  weekStartsOn,
  onChangeDate,
}: {
  selectedDate: Date;
  gridBottomOffset?: number;
  weekStartsOn?: Day;
  onChangeDate: TimeGridActionsProps['onChangeDate'];
}) => {
  const locale = useDateLocale();
  const theme = useTheme();
  const { orientation } = useScreenOrientation();
  const { left, right } = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { isSmall } = useScreenSize();
  const { now } = useNativeNow();

  const ref = useRef<TimeGridRef>(null);

  const paddings = useMemo(
    () => ({
      left: orientation === Orientation.LANDSCAPE_LEFT ? 0 : left,
      right: orientation === Orientation.LANDSCAPE_RIGHT ? 0 : right,
    }),
    [left, orientation, right],
  );

  const adjustedWidth = useMemo(
    () => width - paddings.left - paddings.right,
    [paddings.left, paddings.right, width],
  );
  const numberOfDays = useMemo(
    () =>
      !isSmall &&
      (DeviceInfo.deviceType === DeviceType.TABLET ||
        DeviceInfo.deviceType === DeviceType.DESKTOP ||
        orientation === Orientation.LANDSCAPE_LEFT ||
        orientation === Orientation.LANDSCAPE_RIGHT)
        ? 7
        : 3,
    [isSmall, orientation],
  );

  const goToday = useCallback(() => {
    ref.current?.toDatetime(new Date(), {
      animated: true,
    });
  }, []);

  const renderHeaderSafeArea = useCallback(() => {
    const currentYear = now.getFullYear();
    const selectedDateYear = selectedDate.getFullYear();
    const to = DateHelper.addDays(selectedDate, numberOfDays);
    const isToday = DateHelper.isSameDay(now, selectedDate);
    const format =
      `MMM${currentYear !== selectedDateYear || to.getFullYear() !== selectedDateYear ? ' yy' : ''}`.trim();
    const date = `${DateHelper.format(selectedDate, format)} ${
      !DateHelper.isSameMonth(selectedDate, to)
        ? `\n${DateHelper.format(to, format)}`
        : ''
    }`
      .trim()
      .replace(/\./g, '');

    return (
      <MediumText
        fontSize={12}
        textTransform="uppercase"
        margin="auto"
        color={!isToday ? '$calendarTodayColor' : '$calendarTimeColor'}
        textAlign="center"
      >
        {date}
      </MediumText>
    );
  }, [now, numberOfDays, selectedDate]);

  const renderDayHeader = useCallback(
    ({ date }: { date: Date }) => {
      const isToday = DateHelper.isSameDay(now, date);

      return (
        <View alignItems="center" gap="$1">
          <RegularText
            fontSize={12}
            color={isToday ? '$calendarTodayColor' : '$calendarTimeColor'}
            textTransform="lowercase"
          >
            {DateHelper.format(date, 'EEEEEE').replace(/\./g, '')}
          </RegularText>
          <H3 color={isToday ? '$calendarTodayColor' : '$color'}>
            {DateHelper.format(date, 'dd')}
          </H3>
        </View>
      );
    },
    [now],
  );

  const renderNowIndicator = useCallback(
    () => (
      <XStack
        position="relative"
        width="100%"
        height={1}
        backgroundColor="$calendarNowIndicatorColor"
      >
        <View
          position="absolute"
          left={-2.5}
          top={-2.5}
          width={5}
          height={5}
          backgroundColor="$calendarNowIndicatorColor"
          borderRadius={50}
        />
      </XStack>
    ),
    [],
  );

  return (
    <View flex={1} paddingLeft={paddings.left} paddingRight={paddings.right}>
      <TimeGrid
        swipeable
        scalable
        draggable
        hapticable
        gridTopOffset={5}
        ref={ref}
        snappable={snappable}
        width={adjustedWidth}
        weekStartsOn={weekStartsOn}
        gridBottomOffset={gridBottomOffset + 5}
        locale={locale}
        startDate={selectedDate}
        isAllDayEventsVisible={false}
        horizontalLineSize={1}
        numberOfDays={numberOfDays}
        dayHeaderHeight={60}
        renderDayHeader={renderDayHeader}
        renderHeaderSafeArea={renderHeaderSafeArea}
        renderNowIndicator={renderNowIndicator}
        theme={{
          backgroundColor: theme.background?.val,
          headerSafeAreaBackgroundColor: theme.background?.val,
          dayHeaderBackgroundColor: theme.background?.val,
          verticalLineColor: theme.calendarLineColor?.val,
          horizontalLineColor: theme.calendarLineColor?.val,
          timelineBackgroundColor: theme.background?.val,
          timelineTextColor: theme.calendarTimeColor?.val,
        }}
        onChangeDate={onChangeDate}
        onHeaderSafeAreaPress={goToday}
      />
    </View>
  );
};
