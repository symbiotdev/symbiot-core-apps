import { Control, FieldValues, Path } from 'react-hook-form';
import { WeekdaysScheduleController } from '@symbiot-core-apps/form-controller';
import { useI18n } from '@symbiot-core-apps/shared';

export function BrandEmployeeLocationScheduleController<
  T extends FieldValues,
>(props: {
  name: Path<T>;
  control: Control<T>;
  disabled?: boolean;
  disableDrag?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useI18n();

  return (
    <WeekdaysScheduleController
      rules={{
        required: {
          value: true,
          message: t('brand_employee.form.schedules.error.required'),
        },
      }}
      {...props}
    />
  );
}
