import { View, XStack } from 'tamagui';
import { DateHelper, Weekday } from '@symbiot-core-apps/shared';
import { useCallback, useMemo, useRef, useState } from 'react';
import * as yup from 'yup';
import { MediumText, RegularText } from '../text/text';
import { InputFieldView } from '../view/input-field-view';
import {
  AdaptivePopover,
  AdaptivePopoverRef,
  popoverPadding,
} from '../popover/adaptive-popover';
import {
  toggleGap,
  ToggleGroup,
  toggleItemMinHeight,
  ToggleOnChange,
} from './toggle-group';
import { H3 } from '../text/heading';
import { Switch } from './switch';
import { Segment } from '../segment/segment';
import { useT } from '@symbiot-core-apps/i18n';
import { EmptyView } from '../view/empty-view';
import { Picker } from './picker';
import { Platform } from 'react-native';

export type WeekdaySchedule = {
  day: Weekday;
  start: number;
  end: number;
};

type MinutesOptions = { label: string; value: number }[];

export const getWeekdayScheduleScheme = (error: string) => {
  return yup
    .array()
    .of(
      yup.object().shape({
        day: yup.number().required(),
        start: yup.number().required(),
        end: yup.number().required(),
      }),
    )
    .required();
};

const minutesInterval = 15;

export const WeekdaysSchedule = ({
  value,
  weekStartsOn,
  disabled,
  onChange,
}: {
  value: WeekdaySchedule[];
  weekStartsOn?: Weekday;
  disabled?: boolean;
  onChange: (value: WeekdaySchedule[]) => void;
}) => {
  const minutes: MinutesOptions = useMemo(
    () => DateHelper.get24HoursInFormattedTime(minutesInterval),
    [],
  );
  const weekdays = useMemo(
    () => DateHelper.getWeekdays({ weekStartsOn }),
    [weekStartsOn],
  );

  const onChangeWeekdaySchedule = useCallback(
    (weekdaySchedule: WeekdaySchedule) => {
      onChange?.(
        value.map((valueItem) =>
          valueItem.day === weekdaySchedule.day ? weekdaySchedule : valueItem,
        ),
      );
    },
    [onChange, value],
  );

  return (
    <View gap="$2" disabled={disabled}>
      {weekdays.map((weekday, index) => (
        <WeekdayScheduleElement
          key={index}
          disabled={disabled}
          minutes={minutes}
          weekday={weekday}
          value={value?.find(({ day }) => day === weekday.value)}
          onChange={onChangeWeekdaySchedule}
        />
      ))}
    </View>
  );
};

const WeekdayScheduleElement = ({
  value,
  disabled,
  weekday,
  minutes,
  onChange,
}: {
  value?: WeekdaySchedule;
  disabled?: boolean;
  weekday: { label: string; value: number };
  minutes: MinutesOptions;
  onChange: (value: WeekdaySchedule) => void;
}) => {
  const { t } = useT();

  const popoverRef = useRef<AdaptivePopoverRef>(null);

  const [activeSegment, setActiveSegment] = useState<string>('start');

  const endMinutes = useMemo(
    () =>
      !value?.start
        ? minutes
        : minutes.filter((minuteItem) => minuteItem.value > value?.start),
    [minutes, value?.start],
  );

  const { start, end, isDayOff } = useMemo(() => {
    const startOfDay = DateHelper.startOfDay(new Date());

    return {
      start: DateHelper.format(
        DateHelper.addMinutes(startOfDay, value?.start || 0),
        'p',
      ),
      end: DateHelper.format(
        DateHelper.addMinutes(startOfDay, value?.end || 0),
        'p',
      ),
      isDayOff: !value?.start && !value?.end,
    };
  }, [value?.end, value?.start]);

  const segmentItems = useMemo(
    () => [
      {
        placeholder: t('schedule.start'),
        label: isDayOff ? '-' : start,
        value: 'start',
      },
      {
        placeholder: t('schedule.end'),
        label: isDayOff ? '-' : end,
        value: 'end',
      },
    ],
    [end, isDayOff, start, t],
  );

  const resetSegment = useCallback(() => setActiveSegment('start'), []);

  const toggleDayOff = useCallback(
    (active: boolean) => {
      onChange({
        ...value,
        day: weekday.value as Weekday,
        ...(!active
          ? {
              start: 0,
              end: 0,
            }
          : {
              start: 9 * 60,
              end: 18 * 60,
            }),
      });
    },
    [onChange, value, weekday.value],
  );

  const scrollTo = useCallback((minutes: MinutesOptions, value?: number) => {
    popoverRef.current?.scrollTo(
      !value
        ? 0
        : minutes.findIndex((minuteItem) => minuteItem.value === value) *
            (toggleItemMinHeight + toggleGap) -
            100,
    );
  }, []);

  const scrollStartToActiveTime = useCallback(
    () => scrollTo(minutes, value?.start),
    [scrollTo, minutes, value?.start],
  );

  const scrollEndToActiveTime = useCallback(
    () => scrollTo(endMinutes, value?.end),
    [scrollTo, endMinutes, value?.end],
  );

  const onChangeStartValue = useCallback(
    (start: number) =>
      onChange({
        ...value,
        day: weekday.value as Weekday,
        start,
        end:
          value?.end && value.end <= start
            ? start + minutesInterval
            : value?.end || start + minutesInterval,
      }),
    [onChange, value, weekday.value],
  );

  const onChangeEndValue = useCallback(
    (end: number) =>
      onChange({
        ...value,
        day: weekday.value as Weekday,
        end,
        start:
          value?.start && value.start >= end
            ? end - minutesInterval
            : value?.start || end - minutesInterval,
      }),
    [onChange, value, weekday.value],
  );

  return (
    <AdaptivePopover
      ignoreScrollTopOnClose
      key={`weekday${weekday.value}`}
      ref={popoverRef}
      triggerType="child"
      placement="bottom"
      maxHeight={300}
      minWidth={250}
      ignoreScroll={Platform.OS === 'ios'}
      trigger={
        <InputFieldView justifyContent="space-between" disabled={disabled}>
          <RegularText>{weekday.label}</RegularText>

          <MediumText color={'$disabled'}>
            {isDayOff ? t('schedule.day_off') : `${start} - ${end}`}
          </MediumText>
        </InputFieldView>
      }
      topFixedContent={
        <View width="100%" alignItems="center" gap="$3">
          <XStack
            width="100%"
            alignItems="center"
            justifyContent="space-between"
            gap="$5"
          >
            <H3>{weekday.label}</H3>
            <Switch checked={!isDayOff} onChange={toggleDayOff} />
          </XStack>

          <Segment
            disabled={isDayOff}
            value={activeSegment}
            items={segmentItems}
            onChange={setActiveSegment}
          />
        </View>
      }
      onOpen={resetSegment}
      onClose={resetSegment}
    >
      {!isDayOff ? (
        <>
          {activeSegment === 'start' && (
            <MinutesPicker
              value={value?.start}
              minutes={minutes}
              onChange={onChangeStartValue}
              onRendered={scrollStartToActiveTime}
            />
          )}

          {activeSegment === 'end' && (
            <MinutesPicker
              value={value?.end}
              minutes={endMinutes}
              onChange={onChangeEndValue}
              onRendered={scrollEndToActiveTime}
            />
          )}
        </>
      ) : (
        <EmptyView
          padding={75.5}
          iconName="Calendar"
          message={t('schedule.day_off')}
        />
      )}
    </AdaptivePopover>
  );
};

const MinutesPicker = ({
  value,
  minutes,
  onChange,
  onRendered,
}: {
  value?: number;
  minutes: MinutesOptions;
  onChange: (value: number) => void;
  onRendered?: () => void;
}) => {
  return Platform.OS === 'ios' ? (
    <Picker
      value={value}
      options={minutes}
      paddingHorizontal={popoverPadding}
      onChange={onChange as ToggleOnChange}
    />
  ) : (
    <ToggleGroup
      renderDelay={250}
      value={value}
      items={minutes}
      onRendered={onRendered}
      onChange={onChange as ToggleOnChange}
    />
  );
};
