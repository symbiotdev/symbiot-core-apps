import { Control, Controller } from 'react-hook-form';
import { TimeScheduleController } from '@symbiot-core-apps/form-controller';
import { View } from 'tamagui';
import { DatePicker, SelectPicker } from '@symbiot-core-apps/ui';
import { DateHelper } from '@symbiot-core-apps/shared';
import { useTranslation } from 'react-i18next';
import { isBrandBookingAllDay } from '@symbiot-core-apps/api';

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
  const { t } = useTranslation();

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

                  props.onBlur?.()
                } else {
                  const now = DateHelper.roundTime(new Date(), 5);

                  start = DateHelper.addMinutes(
                    start,
                    DateHelper.differenceInMinutes(
                      now,
                      DateHelper.startOfDay(now),
                    ),
                  );

                  onChange({
                    start,
                    end: DateHelper.addMinutes(start, 30),
                  });
                }
              }}
            />

            {!isAllDay && (
              <TimeScheduleController
                {...props}
                name="datetime"
                disabled={props.disabled || isAllDay}
              />
            )}
          </View>
        );
      }}
    />
  );
}
