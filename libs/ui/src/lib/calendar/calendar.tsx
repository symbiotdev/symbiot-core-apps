import {
  TimeGrid,
  TimeGridActionsProps,
} from '@symbiot.dev/react-native-timegrid-pro';
import { Platform } from 'react-native';
import { useDateLocale } from '@symbiot-core-apps/i18n';
import { useCallback } from 'react';
import { useTheme, View } from 'tamagui';
import { DateHelper } from '@symbiot-core-apps/shared';
import { MediumText, RegularText } from '../text/text';
import { H3 } from '../text/heading';

const snappable = Platform.OS !== 'web';
const numberOfDays = 3;

export const Calendar = ({
  selectedDate,
  gridBottomOffset = 0,
  onChangeDate,
}: {
  selectedDate: Date;
  gridBottomOffset?: number;
  onChangeDate: TimeGridActionsProps['onChangeDate'];
}) => {
  const locale = useDateLocale();
  const theme = useTheme();

  const renderDayHeader = useCallback(
    ({ date }: { date: Date }) => (
      <View alignItems="center">
        <RegularText
          fontSize={12}
          color="$calendarTimeColor"
          textTransform="lowercase"
        >
          {DateHelper.format(date, 'EEEEEE').replace(/\./g, '')}
        </RegularText>
        <H3>{DateHelper.format(date, 'dd')}</H3>
      </View>
    ),
    [],
  );

  const renderHeaderSafeArea = useCallback(() => {
    const currentYear = new Date().getFullYear();
    const selectedDateYear = selectedDate.getFullYear();
    const to = DateHelper.addDays(selectedDate, numberOfDays);
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
        color="$calendarTimeColor"
        textAlign="center"
      >
        {date}
      </MediumText>
    );
  }, [selectedDate]);

  return (
    <TimeGrid
      swipeable
      scalable
      draggable
      hapticable
      snappable={snappable}
      gridTopOffset={5}
      gridBottomOffset={gridBottomOffset + 5}
      locale={locale}
      startDate={selectedDate}
      isAllDayEventsVisible={false}
      horizontalLineSize={1}
      numberOfDays={3}
      dayHeaderHeight={60}
      renderDayHeader={renderDayHeader}
      renderHeaderSafeArea={renderHeaderSafeArea}
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
    />
  );
};
