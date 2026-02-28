import { XStack } from 'tamagui';
import { DateHelper, isIos, useI18n, Weekday } from '@symbiot-core-apps/shared';
import { useCallback, useMemo, useState } from 'react';
import { Picker, PickerOnChange } from './picker';
import {
  CompactView,
  H4,
  LightText,
  MediumText,
  Segment,
} from '@symbiot-core-apps/ui';
import { FormField } from '../wrapper/form-field';
import { InputFieldView } from '../wrapper/input-field-view';
import { Switch } from './switch';
import { useCurrentAccountPreferences } from '@symbiot-core-apps/state';
import { AdaptiveSheet, EmptyView } from '@symbiot-core-apps/ui2';

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
  onChange,
  onBlur,
}: {
  label?: string;
  value: WeekdaySchedule[];
  weekStartsOn?: Weekday;
  disabled?: boolean;
  required?: boolean;
  onChange: (value: WeekdaySchedule[]) => void;
  onBlur?: () => void;
}) => {
  const preferences = useCurrentAccountPreferences();
  const minutes: MinutesOptions = useMemo(
    () =>
      DateHelper.get24HoursInFormattedTime(
        minutesInterval,
        preferences.timeFormat,
      ),
    [preferences.timeFormat],
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
  weekday,
  minutes,
  onChange,
  onBlur,
}: {
  value?: WeekdaySchedule;
  disabled?: boolean;
  weekday: { label: string; value: number };
  minutes: MinutesOptions;
  onChange: (value: WeekdaySchedule) => void;
  onBlur?: () => void;
}) => {
  const { t } = useI18n();
  const preferences = useCurrentAccountPreferences();

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
        preferences.timeFormat,
      ),
      end: DateHelper.format(
        DateHelper.addMinutes(startOfDay, value?.end || 0),
        preferences.timeFormat,
      ),
      isDayOff: value && DateHelper.isDayOff(value.start, value.end),
    };
  }, [value, preferences.timeFormat]);

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
    <AdaptiveSheet
      excludePaddings
      sheetGestureDisabled={isIos}
      sheetHandleVisible={!isIos}
      key={`weekday${weekday.value}`}
      popoverPlacement="bottom-start"
      trigger={
        <InputFieldView justifyContent="space-between" disabled={disabled}>
          <LightText>{weekday.label}</LightText>

          <MediumText color={'$disabled'}>
            {isDayOff ? t('shared.schedule.day_off') : `${start} - ${end}`}
          </MediumText>
        </InputFieldView>
      }
      onOpen={resetSegment}
      onClose={onClose}
    >
      <CompactView gap="$3" padding={20}>
        <XStack gap="$5" alignItems="center" justifyContent="space-between">
          <H4>{weekday.label}</H4>
          <Switch checked={!isDayOff} onChange={toggleDayOff} />
        </XStack>

        <Segment
          disabled={isDayOff}
          value={activeSegment}
          items={segmentItems}
          onChange={setActiveSegment}
        />
      </CompactView>

      {!isDayOff ? (
        <CompactView paddingHorizontal={20} paddingBottom={20}>
          {activeSegment === 'start' && (
            <Picker
              lazy
              value={value?.start}
              options={minutes}
              onChange={onChangeStartValue as PickerOnChange}
            />
          )}

          {activeSegment === 'end' && (
            <Picker
              lazy
              value={value?.end}
              options={endMinutes}
              onChange={onChangeEndValue as PickerOnChange}
            />
          )}
        </CompactView>
      ) : (
        <EmptyView
          style={{ padding: 75.5 }}
          iconName="Calendar"
          message={t('shared.schedule.day_off')}
        />
      )}
    </AdaptiveSheet>
  );
};
