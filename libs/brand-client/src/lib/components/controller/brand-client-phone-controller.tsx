import { PhoneInput, validatePhone } from '@symbiot-core-apps/ui';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export function BrandClientPhoneController<T extends FieldValues>({
  name,
  control,
  disabled,
  onBlur,
}: {
  name: Path<T>;
  control: Control<T>;
  disabled?: boolean;
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
            t(
              value
                ? 'brand_client.form.phone.error.validation'
                : 'brand_client.form.phone.error.required',
            ),
            true,
          ),
      }}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <PhoneInput
          disabled={disabled}
          value={value}
          error={error?.message}
          label={t('brand_client.form.phone.label')}
          placeholder={t('brand_client.form.phone.placeholder')}
          onChange={onChange}
          onBlur={onBlur}
        />
      )}
    />
  );
}
