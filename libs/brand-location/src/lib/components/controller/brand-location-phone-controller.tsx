import { Control, FieldValues, Path } from 'react-hook-form';
import { PhoneController } from '@symbiot-core-apps/form-controller';
import { useI18n } from '@symbiot-core-apps/shared';

export function BrandLocationPhoneController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  noLabel?: boolean;
  disabled?: boolean;
  required?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useI18n();

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
