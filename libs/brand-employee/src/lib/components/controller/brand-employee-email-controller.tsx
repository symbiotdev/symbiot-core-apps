import { Control, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { EmailController } from '@symbiot-core-apps/form-controller';

export function BrandEmployeeEmailController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  noLabel?: boolean;
  disabled?: boolean;
  required?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();

  return (
    <EmailController
      label={!props.noLabel ? t('brand_employee.form.email.label') : ''}
      placeholder={t('brand_employee.form.email.placeholder')}
      errors={{
        required: t('brand_employee.form.email.error.required'),
        validation: t('brand_employee.form.email.error.validation'),
      }}
      {...props}
    />
  );
}
