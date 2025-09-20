import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { InstagramInput } from '@symbiot-core-apps/ui';

export function BrandLocationInstagramsController<T extends FieldValues>({
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
      name={name}
      control={control}
      rules={{
        required: {
          value: Boolean(required),
          message: t('brand_location.form.instagrams.error.required'),
        },
      }}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <InstagramInput
          enterKeyHint="done"
          disabled={disabled}
          value={value}
          label={!noLabel ? t('brand_location.form.instagram.label') : ''}
          placeholder={t('brand_location.form.instagram.placeholder')}
          error={error?.message}
          onChange={onChange}
          onBlur={onBlur}
        />
      )}
    />
  );
}
