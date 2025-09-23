import { Control, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { PhoneController } from '@symbiot-core-apps/form-controller';

export function BrandEmployeePhoneController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  disabled?: boolean;
  required?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();

  return (
    <PhoneController
      required={props.required}
      label={t('brand_employee.form.phone.label')}
      placeholder={t('brand_employee.form.phone.placeholder')}
      errors={{
        required: t('brand_employee.form.phone.error.required'),
        validation: t('brand_employee.form.phone.error.validation'),
      }}
      {...props}
    />
  );
}
