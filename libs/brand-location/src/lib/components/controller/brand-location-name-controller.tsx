import { Input } from '@symbiot-core-apps/ui';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useCurrentBrandState } from '@symbiot-core-apps/state';

export function BrandLocationNameController<T extends FieldValues>({
  name,
  control,
  noLabel,
  disabled,
  onBlur,
}: {
  name: Path<T>;
  control: Control<T>;
  noLabel?: boolean;
  disabled?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();
  const { brand } = useCurrentBrandState();

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required: {
          value: true,
          message: t('brand_location.form.name.error.required'),
        },
      }}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <Input
          autoCapitalize="words"
          enterKeyHint="done"
          disabled={disabled}
          value={value}
          error={error?.message}
          label={!noLabel ? t('brand_location.form.name.label') : undefined}
          placeholder={t('brand_location.form.name.placeholder', {
            brandName: brand?.name,
          })}
          onChange={onChange}
          onBlur={onBlur}
        />
      )}
    />
  );
}
