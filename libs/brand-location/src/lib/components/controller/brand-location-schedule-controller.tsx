import { WeekdaySchedule, WeekdaysSchedule } from '@symbiot-core-apps/ui';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useCurrentAccount } from '@symbiot-core-apps/state';

export function BrandLocationScheduleController<T extends FieldValues>({
  name,
  control,
  disabled,
  disableDrag,
}: {
  name: Path<T>;
  control: Control<T>;
  disabled?: boolean;
  disableDrag?: boolean;
}) {
  const { me } = useCurrentAccount();
  const { t } = useTranslation();

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required: {
          value: true,
          message: t('brand.form.schedule.error.required'),
        },
      }}
      render={({ field: { value, onChange } }) => (
        <WeekdaysSchedule
          disabled={disabled}
          disableDrag={disableDrag}
          value={value as WeekdaySchedule[]}
          weekStartsOn={me?.preferences?.weekStartsOn}
          onChange={onChange}
        />
      )}
    />
  );
}
