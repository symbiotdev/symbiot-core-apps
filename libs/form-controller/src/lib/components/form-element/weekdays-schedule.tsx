import { XStack } from 'tamagui';
import { DateHelper, useI18n, Weekday } from '@symbiot-core-apps/shared';
import { useCallback, useMemo, useState } from 'react';
import { Picker } from './picker';
import {
  AdaptivePopover,
  EmptyView,
  FrameView,
  H4,
  LightText,
  MediumText,
  Segment,
} from '@symbiot-core-apps/ui';
import { FormField } from '../wrapper/form-field';
import { InputFieldView } from '../wrapper/input-field-view';
import { ToggleOnChange } from './toggle-group';
import { Switch } from './switch';

export type WeekdaySchedule = {
  day: number;
  start: number;
  end: number;
};

type MinutesOptions = { label: string; value: number }[];

const minutesInterval = 15;

export const WeekdaysSchedule = ({
  label,
  value,
  weekStartsOn,
  disabled,
  required,
  disableDrag,
  onChange,
  onBlur,
}: {
  label?: string;
  value: WeekdaySchedule[];
  weekStartsOn?: Weekday;
  disabled?: boolean;
  required?: boolean;
  disableDrag?: boolean;
  onChange: (value: WeekdaySchedule[]) => void;
  onBlur?: () => void;
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
    <FormField label={label} required={required}>
      {weekdays.map((weekday, index) => (
        <WeekdayScheduleElement
          key={index}
          disabled={disabled}
          disableDrag={disableDrag}
          minutes={minutes}
          weekday={weekday}
          value={value?.find(({ day }) => day === weekday.value)}
          onChange={onChangeWeekdaySchedule}
          onBlur={onBlur}
        />
      ))}
    </FormField>
  );
};

const WeekdayScheduleElement = ({
  value,
  disabled,
  disableDrag,
  weekday,
  minutes,
  onChange,
  onBlur,
}: {
  value?: WeekdaySchedule;
  disabled?: boolean;
  disableDrag?: boolean;
  weekday: { label: string; value: number };
  minutes: MinutesOptions;
  onChange: (value: WeekdaySchedule) => void;
  onBlur?: () => void;
}) => {
  const { t } = useI18n();

  const [activeSegment, setActiveSegment] = useState<string>('start');

  const endMinutes = useMemo(
    () =>
      typeof value?.start !== 'number'
        ? minutes
        : minutes.filter((minuteItem) => minuteItem.value > value.start),
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
      isDayOff: value && DateHelper.isDayOff(value.start, value.end),
    };
  }, [value]);

  const segmentItems = useMemo(
    () => [
      {
        placeholder: t('shared.schedule.start'),
        label: isDayOff ? '-' : start,
        value: 'start',
      },
      {
        placeholder: t('shared.schedule.end'),
        label: isDayOff ? '-' : end,
        value: 'end',
      },
    ],
    [end, isDayOff, start, t],
  );

  const resetSegment = useCallback(() => setActiveSegment('start'), []);

  const onClose = useCallback(() => {
    resetSegment();
    onBlur?.();
  }, [onBlur, resetSegment]);

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

  const onChangeStartValue = useCallback(
    (start: number) => {
      const endDefined = typeof value?.end === 'number';

      onChange({
        ...value,
        start,
        day: weekday.value as Weekday,
        end:
          endDefined && value.end <= start
            ? start + minutesInterval
            : endDefined
              ? value.end
              : start + minutesInterval,
      });
    },
    [onChange, value, weekday.value],
  );

  const onChangeEndValue = useCallback(
    (end: number) => {
      const startDefined = typeof value?.start === 'number';

      onChange({
        ...value,
        end,
        day: weekday.value as Weekday,
        start:
          startDefined && value.start >= end
            ? end - minutesInterval
            : startDefined
              ? value.start
              : end - minutesInterval,
      });
    },
    [onChange, value, weekday.value],
  );

  return (
    <AdaptivePopover
      ignoreScroll
      disableDrag={disableDrag}
      key={`weekday${weekday.value}`}
      placement="bottom"
      maxHeight={300}
      minWidth={250}
      trigger={
        <InputFieldView
          justifyContent="space-between"
          disabled={disabled}
          pressStyle={{ opacity: 0.8 }}
        >
          <LightText>{weekday.label}</LightText>

          <MediumText color={'$disabled'}>
            {isDayOff ? t('shared.schedule.day_off') : `${start} - ${end}`}
          </MediumText>
        </InputFieldView>
      }
      topFixedContent={
        <FrameView gap="$3">
          <XStack
            flex={1}
            alignItems="center"
            justifyContent="space-between"
            gap="$5"
          >
            <H4 flex={1}>{weekday.label}</H4>
            <Switch checked={!isDayOff} onChange={toggleDayOff} />
          </XStack>

          <Segment
            disabled={isDayOff}
            value={activeSegment}
            items={segmentItems}
            onChange={setActiveSegment}
          />
        </FrameView>
      }
      onOpen={resetSegment}
      onClose={onClose}
    >
      {!isDayOff ? (
        <FrameView>
          {activeSegment === 'start' && (
            <Picker
              lazy
              value={value?.start}
              options={minutes}
              onChange={onChangeStartValue as ToggleOnChange}
            />
          )}

          {activeSegment === 'end' && (
            <Picker
              lazy
              value={value?.end}
              options={endMinutes}
              onChange={onChangeEndValue as ToggleOnChange}
            />
          )}
        </FrameView>
      ) : (
        <EmptyView
          padding={75.5}
          iconName="Calendar"
          message={t('shared.schedule.day_off')}
        />
      )}
    </AdaptivePopover>
  );
};
