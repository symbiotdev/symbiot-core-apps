import { PhoneInput, validatePhone } from '@symbiot-core-apps/ui';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export function BrandLocationPhonesController<T extends FieldValues>({
  name,
  control,
  noLabel,
  disabled,
  required,
  onBlur,
}: {
  name: Path<T>;
  control: Control<T>;
  noLabel?: boolean;
  disabled?: boolean;
  required?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        validate: (value) =>
          validatePhone(
            value,
            t('brand_location.form.phones.error.validation'),
            required,
          ),
      }}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <PhoneInput
          disabled={disabled}
          value={value}
          error={error?.message}
          label={!noLabel ? t('brand_location.form.phones.label') : undefined}
          placeholder={t('brand_location.form.phones.placeholder')}
          onChange={onChange}
          onBlur={onBlur}
        />
      )}
    />
  );
}
