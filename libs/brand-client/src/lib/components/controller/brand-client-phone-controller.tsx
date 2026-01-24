import { Control, FieldValues, Path } from 'react-hook-form';
import { PhoneController } from '@symbiot-core-apps/form-controller';
import { useI18n } from '@symbiot-core-apps/shared';

export function BrandClientPhoneController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  disabled?: boolean;
  required?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useI18n();

  return (
    <PhoneController
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
