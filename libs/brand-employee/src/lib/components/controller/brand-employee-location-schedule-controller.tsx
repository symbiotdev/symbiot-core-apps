import { Control, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ScheduleController } from '@symbiot-core-apps/form-controller';

export function BrandEmployeeLocationScheduleController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  disabled?: boolean;
  disableDrag?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();

  return (
    <ScheduleController
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
