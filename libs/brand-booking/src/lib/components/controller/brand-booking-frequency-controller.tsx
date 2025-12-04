import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'tamagui';
import { useMemo } from 'react';
import { DatePicker, SelectPicker } from '@symbiot-core-apps/ui';
import { DateHelper } from '@symbiot-core-apps/shared';
import {
  BrandBookingFrequency,
  getEndDateByBrandBookingFrequency,
} from '@symbiot-core-apps/api';
import { useCurrentAccountState } from '@symbiot-core-apps/state';

export function BrandBookingFrequencyController<
  T extends FieldValues & {
    frequency: { type: BrandBookingFrequency; endDate?: Date };
  },
>(props: {
  name: Path<T>;
  control: Control<T>;
  minDate: Date;
  label?: string;
  disabled?: boolean;
  disableDrag?: boolean;
}) {
  const { t } = useTranslation();
  const { me } = useCurrentAccountState();

  const options = useMemo(
    () => [
      {
        label: t('shared.schedule.frequency.no_repeat'),
        value: BrandBookingFrequency.noRepeat,
      },
      {
        label: t('shared.schedule.frequency.every_workday'),
        value: BrandBookingFrequency.everyWorkday,
      },
      {
        label: t('shared.schedule.frequency.every_day'),
        value: BrandBookingFrequency.everyDay,
      },
      {
        label: t('shared.schedule.frequency.every_week'),
        value: BrandBookingFrequency.everyWeek,
      },
      {
        label: t('shared.schedule.frequency.every_month'),
        value: BrandBookingFrequency.everyMonth,
      },
    ],
    [t],
  );

  return (
    <Controller
      name={'frequency' as Path<T>}
      control={props.control}
      render={({ field: { value, onChange } }) => {
        return (
          <View gap="$2">
            <SelectPicker
              {...props}
              value={value.type}
              options={options}
              onChange={(type) => {
                const maxDate = getEndDateByBrandBookingFrequency(
                  props.minDate,
                  type as BrandBookingFrequency,
                );

                onChange({
                  type,
                  endDate:
                    !maxDate ||
                    !value.endDate ||
                    DateHelper.isAfter(value.endDate, maxDate)
                      ? maxDate
                      : value.endDate,
                });
              }}
            />

            {value.type !== BrandBookingFrequency.noRepeat && (
              <DatePicker
                {...props}
                value={value.endDate}
                label={t('shared.schedule.frequency_until')}
                formatStr={me?.preferences?.dateFormat}
                maxDate={getEndDateByBrandBookingFrequency(
                  props.minDate,
                  value.type,
                )}
                onChange={(endDate) => {
                  onChange({
                    ...value,
                    endDate,
                  });
                }}
              />
            )}
          </View>
        );
      }}
    />
  );
}
