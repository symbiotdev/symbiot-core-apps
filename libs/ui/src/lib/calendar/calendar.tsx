import {
  TimeGrid,
  TimeGridProps,
  TimeGridRef,
} from '@symbiot.dev/react-native-timegrid-pro';
import { LayoutChangeEvent, Platform } from 'react-native';
import { useDateLocale } from '@symbiot-core-apps/i18n';
import { Ref, useCallback, useMemo, useState } from 'react';
import { useTheme, View, XStack } from 'tamagui';
import {
  DateHelper,
  DeviceInfo,
  isTablet,
  useNativeNow,
  useScreenOrientation,
  useScreenSize,
} from '@symbiot-core-apps/shared';
import { BoldText, RegularText } from '../text/text';
import { Orientation } from 'expo-screen-orientation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DeviceType } from 'expo-device';
import { DeterminedProgressBar } from '../loading/determined-progress';

export const Calendar = ({
  loading,
  timeGridRef,
  ...timeGridProps
}: Omit<TimeGridProps, 'ref'> & {
  loading?: boolean;
  timeGridRef?: Ref<TimeGridRef>;
  gridBottomOffset?: number;
}) => {
  const locale = useDateLocale();
  const theme = useTheme();
  const { media } = useScreenSize();
  const { orientation } = useScreenOrientation();
  const { left, right } = useSafeAreaInsets();
  const { now } = useNativeNow();

  const [width, setWidth] = useState(0);

  const numberOfDays = useMemo(
    () =>
      ['sm', 'md', 'lg', 'xl'].includes(media) &&
      (isTablet ||
        DeviceInfo.deviceType === DeviceType.DESKTOP ||
        orientation === Orientation.LANDSCAPE_LEFT ||
        orientation === Orientation.LANDSCAPE_RIGHT)
        ? 7
        : 3,
    [media, orientation],
  );

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

  const renderDayHeader = useCallback(
    ({ date }: { date: Date }) => {
      const isToday = DateHelper.isSameDay(now, date);

      return (
        <View alignItems="center" gap="$1">
          <RegularText
            fontSize={10}
            color={isToday ? '$color' : '$calendarTimeColor'}
            textTransform="lowercase"
          >
            {DateHelper.format(date, 'EEEEEE').replace(/\./g, '')}
          </RegularText>

          <BoldText
            color={isToday ? '$calendarTodayColor' : '$calendarTimeColor'}
            paddingHorizontal={6}
            paddingVertical={3}
            fontSize={18}
            borderRadius="$4"
            backgroundColor={isToday ? '$background' : undefined}
          >
            {DateHelper.format(date, 'dd')}
          </BoldText>
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
      backgroundColor="$calendarHeaderBackgroundColor"
      width="100%"
      paddingLeft={paddings.left}
      paddingRight={paddings.right}
      onLayout={onLayout}
    >
      {loading && (
        <DeterminedProgressBar
          color={['#dddddd', '#cccccc', '#dddddd', '#cccccc', '#dddddd']}
        />
      )}

      {!!width && (
        <TimeGrid
          swipeable
          scalable
          draggable
          hapticable
          ref={timeGridRef}
          snappable={snappable}
          width={adjustedWidth}
          numberOfDays={timeGridProps.numberOfDays || numberOfDays}
          locale={locale}
          horizontalLineSize={1}
          minScale={1}
          scale={1.4}
          maxScale={3}
          dayHeaderHeight={60}
          renderDayHeader={renderDayHeader}
          renderNowIndicator={renderNowIndicator}
          theme={{
            headerSafeAreaBackgroundColor:
              theme.calendarHeaderBackgroundColor?.val,
            dayHeaderBackgroundColor: theme.calendarHeaderBackgroundColor?.val,
            backgroundColor: theme.calendarBackgroundColor?.val,
            timelineBackgroundColor: theme.calendarHeaderBackgroundColor?.val,
            verticalLineColor: theme.calendarLineColor?.val,
            horizontalLineColor: theme.calendarLineColor?.val,
            timelineTextColor: theme.calendarTimeColor?.val,
            allDayEventsSafeAreaBackgroundColor:
              theme.calendarHeaderBackgroundColor?.val,
          }}
          {...timeGridProps}
        />
      )}
    </View>
  );
};
