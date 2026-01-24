import { Control, Controller } from 'react-hook-form';
import { TimeScheduleController } from '@symbiot-core-apps/form-controller';
import { View } from 'tamagui';
import { DatePicker, SelectPicker } from '@symbiot-core-apps/ui';
import { DateHelper, useI18n } from '@symbiot-core-apps/shared';
import { isBrandBookingAllDay } from '@symbiot-core-apps/api';
import { useCurrentAccountState } from '@symbiot-core-apps/state';

enum Duration {
  allDay,
  custom,
}

export function UnavailableBrandBookingDatetimeController(props: {
  control: Control<{ datetime: { start: Date; end: Date } }>;
  disabled?: boolean;
  disableDrag?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useI18n();
  const { me } = useCurrentAccountState();

  return (
    <Controller
      name="datetime"
      control={props.control}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        const isAllDay = isBrandBookingAllDay(value);

        return (
          <View gap="$2">
            <DatePicker
              {...props}
              label={''}
              value={value.start}
              error={error?.message}
              minDate={new Date()}
              formatStr={me?.preferences?.dateFormat}
              onChange={(newDate) =>
                onChange({
                  start: DateHelper.changeDateKeepTime(value.start, newDate),
                  end: DateHelper.changeDateKeepTime(value.end, newDate),
                })
              }
              onBlur={props.onBlur}
            />

            <SelectPicker
              disableDrag={props.disableDrag}
              label={t('unavailable_brand_booking.form.duration.label')}
              value={isAllDay ? Duration.allDay : Duration.custom}
              options={[
                {
                  label: t('shared.schedule.duration.all_day'),
                  value: Duration.allDay,
                },
                {
                  label: t('shared.schedule.duration.custom'),
                  value: Duration.custom,
                },
              ]}
              onChange={(selectedValue) => {
                let start = DateHelper.startOfDay(value.start);

                if (selectedValue === Duration.allDay) {
                  onChange({
                    start,
                    end: start,
                  });

                  props.onBlur?.();
                } else {
                  start = DateHelper.addHours(DateHelper.startOfDay(start), 12);

                  onChange({
                    start,
                    end: DateHelper.addHours(start, 1),
                  });
                }
              }}
            />

            {!isAllDay && <TimeScheduleController {...props} name="datetime" />}
          </View>
        );
      }}
    />
  );
}
