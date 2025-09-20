import { Input } from '@symbiot-core-apps/ui';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export function BrandNameController<T extends FieldValues>({
  name,
  control,
  noLabel,
  onBlur,
}: {
  name: Path<T>;
  control: Control<T>;
  noLabel?: boolean;
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
          message: t('brand.form.name.error.required'),
        },
      }}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <Input
          autoCapitalize="words"
          enterKeyHint="done"
          value={value}
          error={error?.message}
          label={!noLabel ? t('brand.form.name.label') : undefined}
          placeholder={t('brand.form.name.placeholder')}
          onChange={onChange}
          onBlur={onBlur}
        />
      )}
    />
  );
}
