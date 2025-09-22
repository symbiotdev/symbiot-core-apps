import { Control, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { PhoneController } from '@symbiot-core-apps/form-controller';

export function BrandLocationPhoneController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  noLabel?: boolean;
  disabled?: boolean;
  required?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();

  return (
    <PhoneController
      label={!props.noLabel ? t('brand_location.form.phone.label') : ''}
      placeholder={t('brand_location.form.phone.placeholder')}
      errors={{
        required: t('brand_location.form.phone.error.required'),
        validation: t('brand_location.form.phone.error.validation'),
      }}
      {...props}
    />
  );
}
