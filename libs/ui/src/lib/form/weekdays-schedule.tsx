import { View, XStack } from 'tamagui';
import { DateHelper, Weekday } from '@symbiot-core-apps/shared';
import { useCallback, useMemo, useState } from 'react';
import * as yup from 'yup';
import { MediumText, RegularText } from '../text/text';
import { InputFieldView } from '../view/input-field-view';
import { AdaptivePopover, popoverPadding } from '../popover/adaptive-popover';
import { ToggleOnChange } from './toggle-group';
import { H4 } from '../text/heading';
import { Switch } from './switch';
import { Segment } from '../segment/segment';
import { EmptyView } from '../view/empty-view';
import { Picker } from './picker';
import { useTranslation } from 'react-i18next';
import { FormField } from './form-field';
import { FormView } from '../view/form-view';

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
  label,
  value,
  weekStartsOn,
  disabled,
  disableDrag,
  onChange,
}: {
  label?: string;
  value: WeekdaySchedule[];
  weekStartsOn?: Weekday;
  disabled?: boolean;
  disableDrag?: boolean;
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
    <FormField label={label}>
      {weekdays.map((weekday, index) => (
        <WeekdayScheduleElement
          key={index}
          disabled={disabled}
          disableDrag={disableDrag}
          minutes={minutes}
          weekday={weekday}
          value={value?.find(({ day }) => day === weekday.value)}
          onChange={onChangeWeekdaySchedule}
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
}: {
  value?: WeekdaySchedule;
  disabled?: boolean;
  disableDrag?: boolean;
  weekday: { label: string; value: number };
  minutes: MinutesOptions;
  onChange: (value: WeekdaySchedule) => void;
}) => {
  const { t } = useTranslation();

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
      ignoreScroll
      disableDrag={disableDrag}
      key={`weekday${weekday.value}`}
      triggerType="child"
      placement="bottom"
      maxHeight={300}
      minWidth={250}
      trigger={
        <InputFieldView justifyContent="space-between" disabled={disabled}>
          <RegularText>{weekday.label}</RegularText>

          <MediumText color={'$disabled'}>
            {isDayOff ? t('shared.schedule.day_off') : `${start} - ${end}`}
          </MediumText>
        </InputFieldView>
      }
      topFixedContent={
        <FormView gap="$3">
          <XStack
            width="100%"
            alignItems="center"
            justifyContent="space-between"
            gap="$5"
          >
            <H4>{weekday.label}</H4>
            <Switch checked={!isDayOff} onChange={toggleDayOff} />
          </XStack>

          <Segment
            disabled={isDayOff}
            value={activeSegment}
            items={segmentItems}
            onChange={setActiveSegment}
          />
        </FormView>
      }
      onOpen={resetSegment}
      onClose={resetSegment}
    >
      {!isDayOff ? (
        <FormView>
          {activeSegment === 'start' && (
            <Picker
              lazy
              value={value?.start}
              options={minutes}
              paddingHorizontal={popoverPadding}
              onChange={onChangeStartValue as ToggleOnChange}
            />
          )}

          {activeSegment === 'end' && (
            <Picker
              lazy
              value={value?.end}
              options={endMinutes}
              paddingHorizontal={popoverPadding}
              onChange={onChangeEndValue as ToggleOnChange}
            />
          )}
        </FormView>
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
