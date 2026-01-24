import { Control, FieldValues, Path } from 'react-hook-form';
import { AddressController } from '@symbiot-core-apps/form-controller';
import { useI18n } from '@symbiot-core-apps/shared';

export function BrandLocationAddressController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  noLabel?: boolean;
  required?: boolean;
  disabled?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useI18n();

  return (
    <AddressController
      required
      label={!props.noLabel ? t('brand_location.form.address.label') : ''}
      placeholder={t('brand_location.form.address.placeholder')}
      rules={{
        required: {
          value: true,
          message: t('brand_location.form.address.error.required'),
        },
      }}
      {...props}
    />
  );
}
