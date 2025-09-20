import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { Input } from '@symbiot-core-apps/ui';
import { useTranslation } from 'react-i18next';

export function BrandLocationEntranceController<T extends FieldValues>({
  name,
  control,
  disabled,
  required,
  noLabel,
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
        required: {
          value: Boolean(required),
          message: t('brand_location.form.entrance.error.required'),
        },
      }}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <Input
          disabled={disabled}
          value={value}
          maxLength={64}
          label={!noLabel ? t('brand_location.form.entrance.label') : undefined}
          placeholder={t('brand_location.form.entrance.placeholder')}
          error={error?.message}
          onChange={onChange}
          onBlur={onBlur}
        />
      )}
    />
  );
}
