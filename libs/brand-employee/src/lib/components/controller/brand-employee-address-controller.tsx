import { Control, FieldValues, Path } from 'react-hook-form';
import { StringController } from '@symbiot-core-apps/form-controller';
import { useI18n } from '@symbiot-core-apps/shared';

export function BrandEmployeeAddressController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  required?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useI18n();

  return (
    <StringController
      label={t('brand_employee.form.address.label')}
      placeholder={t('brand_employee.form.address.placeholder')}
      rules={{
        required: {
          value: Boolean(props.required),
          message: t('brand_employee.form.address.error.required'),
        },
      }}
      {...props}
    />
  );
}
