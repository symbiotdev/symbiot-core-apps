import { Control, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { PhoneController } from '@symbiot-core-apps/form-controller';

export function BrandClientPhoneController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  disabled?: boolean;
  required?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();

  return (
    <PhoneController
      required
      label={t('brand_client.form.phone.label')}
      placeholder={t('brand_client.form.phone.placeholder')}
      errors={{
        required: t('brand_client.form.phone.error.required'),
        validation: t('brand_client.form.phone.error.validation'),
      }}
      {...props}
    />
  );
}
