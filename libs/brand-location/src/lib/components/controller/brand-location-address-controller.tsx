import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { AddressPicker } from '@symbiot-core-apps/location';
import { useTranslation } from 'react-i18next';

export function BrandLocationAddressController<T extends FieldValues>({
  name,
  control,
  disabled,
  noLabel,
  onBlur,
}: {
  name: Path<T>;
  control: Control<T>;
  noLabel?: boolean;
  disabled?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required: {
          value: true,
          message: t('brand_location.form.address.error.required'),
        },
      }}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <AddressPicker
          disabled={disabled}
          value={value}
          label={!noLabel ? t('brand_location.form.address.label') : undefined}
          placeholder={t('brand_location.form.address.placeholder')}
          error={error?.message}
          onChange={onChange}
          onBlur={onBlur}
        />
      )}
    />
  );
}
