import { ViewProps, XStack } from 'tamagui';
import { FormField } from './form-field';
import { useCallback, useMemo, useRef } from 'react';
import {
  AdaptivePopover,
  AdaptivePopoverRef,
} from '../popover/adaptive-popover';
import {
  DateHelper,
  minutesInMonth,
  minutesInYear,
} from '@symbiot-core-apps/shared';
import { InputFieldView } from '../view/input-field-view';
import { LightText } from '../text/text';
import { minutesInDay, minutesInHour } from 'date-fns/constants';
import { Picker } from './picker';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';

export type DurationPickerUnit =
  | 'minutes'
  | 'hours'
  | 'days'
  | 'months'
  | 'years';

export const DurationPicker = ({
  units,
  value,
  disabled,
  required,
  label,
  error,
  placeholder,
  minutesInterval,
  hoursInterval,
  daysInterval,
  monthsInterval,
  yearsInterval,
  onChange,
  onBlur,
  ...viewProps
}: Omit<ViewProps, 'onPress'> & {
  units: DurationPickerUnit[];
  value?: number;
  label?: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
  minutesInterval?: number;
  hoursInterval?: number;
  daysInterval?: number;
  monthsInterval?: number;
  yearsInterval?: number;
  onChange?: (value: number) => void;
  onBlur?: () => void;
}) => {
  const { t } = useTranslation();

  const popoverRef = useRef<AdaptivePopoverRef>(null);

  const { minutes, hours, days, months, years } = useMemo(() => {
    const totalMinutes = value || 0;

    const years = Math.floor(totalMinutes / minutesInYear);
    const remainingMinutesAfterYears = totalMinutes % minutesInYear;

    const months = Math.floor(remainingMinutesAfterYears / minutesInMonth);
    const remainingMinutesAfterMonths =
      remainingMinutesAfterYears % minutesInMonth;

    const days = Math.floor(remainingMinutesAfterMonths / minutesInDay);
    const remainingMinutesAfterDays =
      remainingMinutesAfterMonths % minutesInDay;

    const hours = Math.floor(remainingMinutesAfterDays / minutesInHour);
    const minutes = remainingMinutesAfterDays % minutesInHour;

    return { minutes, hours, days, months, years };
  }, [value]);

  const formatOptions = useCallback(
    (max: number, unit: string, interval = 1) =>
      [...new Array(max / interval)].map((_, i) => ({
        label: `${String(i * interval)} ${unit}`,
        value: i * interval,
      })),
    [],
  );
  const yearsOptions = useMemo(
    () =>
      formatOptions(11, t('shared.datetime.short_format.years'), yearsInterval),
    [formatOptions, t, yearsInterval],
  );
  const monthsOptions = useMemo(
    () =>
      formatOptions(
        12,
        t('shared.datetime.short_format.months'),
        monthsInterval,
      ),
    [formatOptions, monthsInterval, t],
  );
  const daysOptions = useMemo(
    () =>
      formatOptions(31, t('shared.datetime.short_format.days'), daysInterval),
    [daysInterval, formatOptions, t],
  );
  const hoursOptions = useMemo(
    () =>
      formatOptions(24, t('shared.datetime.short_format.hours'), hoursInterval),
    [formatOptions, hoursInterval, t],
  );
  const minutesOptions = useMemo(
    () =>
      formatOptions(
        minutesInHour,
        t('shared.datetime.short_format.minutes'),
        minutesInterval || 5,
      ),
    [formatOptions, minutesInterval, t],
  );

  const onChangeDate = useCallback(
    (y: number, m: number, d: number, h: number, min: number) => {
      onChange?.(
        y * minutesInYear +
          m * minutesInMonth +
          d * minutesInDay +
          h * minutesInHour +
          min,
      );
    },
    [onChange],
  );

  return (
    <FormField label={label} error={error} required={required}>
      <AdaptivePopover
        ref={popoverRef}
        disabled={disabled}
        sheetTitle={label}
        trigger={
          <InputFieldView
            disabled={disabled}
            pressStyle={{ opacity: 0.8 }}
            {...viewProps}
          >
            <LightText
              color={
                !value ? '$placeholderColor' : disabled ? '$disabled' : '$color'
              }
            >
              {value ? DateHelper.formatDuration(value) : placeholder}
            </LightText>
          </InputFieldView>
        }
        onClose={onBlur}
      >
        <XStack justifyContent="center" gap={Platform.OS === 'ios' ? 0 : 5}>
          {units.includes('years') && (
            <Picker
              lazy
              options={yearsOptions}
              value={years}
              contentContainerStyle={{ paddingHorizontal: 0 }}
              onChange={(years) =>
                onChangeDate(years as number, months, days, hours, minutes)
              }
            />
          )}

          {units.includes('months') && (
            <Picker
              lazy
              options={monthsOptions}
              value={months}
              contentContainerStyle={{ paddingHorizontal: 0 }}
              onChange={(months) =>
                onChangeDate(years, months as number, days, hours, minutes)
              }
            />
          )}

          {units.includes('days') && (
            <Picker
              lazy
              options={daysOptions}
              value={days}
              contentContainerStyle={{ paddingHorizontal: 0 }}
              onChange={(days) =>
                onChangeDate(years, months, days as number, hours, minutes)
              }
            />
          )}

          {units.includes('hours') && (
            <Picker
              lazy
              options={hoursOptions}
              value={hours}
              contentContainerStyle={{ paddingHorizontal: 0 }}
              onChange={(hours) =>
                onChangeDate(years, months, days, hours as number, minutes)
              }
            />
          )}

          {units.includes('minutes') && (
            <Picker
              lazy
              options={minutesOptions}
              value={minutes}
              contentContainerStyle={{ paddingHorizontal: 0 }}
              onChange={(minutes) =>
                onChangeDate(years, months, days, hours, minutes as number)
              }
            />
          )}
        </XStack>
      </AdaptivePopover>
    </FormField>
  );
};
