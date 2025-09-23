import { Control, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StringController } from '@symbiot-core-apps/form-controller';

export function BrandNewEmployeeIdController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  disabled?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();

  return (
    <StringController
      label={t('brand_employee.form.new_employee_id.label')}
      placeholder={t('brand_employee.form.new_employee_id.placeholder')}
      rules={{
        required: {
          value: true,
          message: t('brand_employee.form.new_employee_id.error.required'),
        },
      }}
      {...props}
    />
  );
}
