import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'tamagui';
import { useMemo } from 'react';
import { DatePicker, SelectPicker } from '@symbiot-core-apps/ui';
import { DateHelper } from '@symbiot-core-apps/shared';
import {
  BookingRepeatType,
  getMaxDateByRepeatType,
} from '@symbiot-core-apps/api';

export function RepeatBrandBookingController(props: {
  control: Control<{ repeat: { type: BookingRepeatType; endDate?: Date } }>;
  minDate: Date;
  disabled?: boolean;
  disableDrag?: boolean;
}) {
  const { t } = useTranslation();

  const repeatOptions = useMemo(
    () => [
      {
        label: t('shared.schedule.repeat.no_repeat'),
        value: BookingRepeatType.noRepeat,
      },
      {
        label: t('shared.schedule.repeat.daily'),
        value: BookingRepeatType.daily,
      },
      {
        label: t('shared.schedule.repeat.weekly'),
        value: BookingRepeatType.weekly,
      },
      {
        label: t('shared.schedule.repeat.monthly'),
        value: BookingRepeatType.monthly,
      },
      // {
      //   label: t('shared.schedule.repeat.custom'),
      //   value: BookingRepeatType.custom,
      // },
    ],
    [t],
  );

  return (
    <Controller
      name="repeat"
      control={props.control}
      render={({ field: { value, onChange } }) => {
        return (
          <View gap="$2">
            <SelectPicker
              {...props}
              value={value.type}
              options={repeatOptions}
              onChange={(type) => {
                const maxDate = getMaxDateByRepeatType(
                  type as BookingRepeatType,
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

            {value.type !== BookingRepeatType.noRepeat && (
              <DatePicker
                {...props}
                value={value.endDate}
                label={t('shared.schedule.repeat_until')}
                minDate={props.minDate}
                maxDate={getMaxDateByRepeatType(value.type)}
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
