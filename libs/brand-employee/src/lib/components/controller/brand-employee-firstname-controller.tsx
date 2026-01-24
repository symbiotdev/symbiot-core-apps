import { Control, FieldValues, Path } from 'react-hook-form';
import { StringController } from '@symbiot-core-apps/form-controller';
import { useI18n } from '@symbiot-core-apps/shared';

export function BrandEmployeeFirstnameController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  required?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useI18n();

  return (
    <StringController
      maxLength={64}
      label={t('brand_employee.form.firstname.label')}
      placeholder={t('brand_employee.form.firstname.placeholder')}
      rules={{
        required: {
          value: true,
          message: t('brand_employee.form.firstname.error.required'),
        },
      }}
      {...props}
    />
  );
}
