import {
  TimeGrid,
  TimeGridActionsProps,
  TimeGridRef,
} from '@symbiot.dev/react-native-timegrid-pro';
import { LayoutChangeEvent, Platform } from 'react-native';
import { useDateLocale } from '@symbiot-core-apps/i18n';
import { ReactElement, Ref, useCallback, useMemo, useState } from 'react';
import { useTheme, View, XStack } from 'tamagui';
import {
  DateHelper,
  DeviceInfo,
  useNativeNow,
  useScreenOrientation,
  useScreenSize,
  Weekday,
} from '@symbiot-core-apps/shared';
import { RegularText } from '../text/text';
import { H3 } from '../text/heading';
import { Orientation } from 'expo-screen-orientation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DeviceType } from 'expo-device';

export const Calendar = ({
  selectedDate,
  timeGridRef,
  gridBottomOffset = 0,
  weekStartsOn,
  renderHeaderSafeArea,
  onChangeDate,
}: {
  selectedDate: Date;
  timeGridRef?: Ref<TimeGridRef>;
  gridBottomOffset?: number;
  weekStartsOn?: Weekday;
  renderHeaderSafeArea?: () => ReactElement;
  onChangeDate: TimeGridActionsProps['onChangeDate'];
}) => {
  const locale = useDateLocale();
  const theme = useTheme();
  const { orientation } = useScreenOrientation();
  const { left, right } = useSafeAreaInsets();
  const { media } = useScreenSize();
  const { now } = useNativeNow();

  const [width, setWidth] = useState(0);

  const snappable = useMemo(
    () => Platform.OS !== 'web' && orientation === Orientation.PORTRAIT_UP,
    [orientation],
  );

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
      ['sm', 'md', 'lg', 'xl'].includes(media) &&
      (DeviceInfo.deviceType === DeviceType.TABLET ||
        DeviceInfo.deviceType === DeviceType.DESKTOP ||
        orientation === Orientation.LANDSCAPE_LEFT ||
        orientation === Orientation.LANDSCAPE_RIGHT)
        ? 7
        : 3,
    [media, orientation],
  );

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

  const onLayout = useCallback(
    (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width),
    [],
  );

  return (
    <View
      flex={1}
      backgroundColor="$background1"
      width="100%"
      paddingLeft={paddings.left}
      paddingRight={paddings.right}
      onLayout={onLayout}
    >
      {!!width && (
        <TimeGrid
          swipeable
          scalable
          draggable
          hapticable
          gridTopOffset={5}
          ref={timeGridRef}
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
          renderHeaderSafeArea={renderHeaderSafeArea}
          renderDayHeader={renderDayHeader}
          renderNowIndicator={renderNowIndicator}
          theme={{
            headerSafeAreaBackgroundColor: theme.background1?.val,
            dayHeaderBackgroundColor: theme.background1?.val,
            backgroundColor: theme.calendarBackgroundColor?.val,
            verticalLineColor: theme.calendarLineColor?.val,
            horizontalLineColor: theme.calendarLineColor?.val,
            timelineBackgroundColor: theme.background1?.val,
            timelineTextColor: theme.color?.val,
          }}
          onChangeDate={onChangeDate}
        />
      )}
    </View>
  );
};
