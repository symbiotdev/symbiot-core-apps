import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { Textarea } from '@symbiot-core-apps/ui';
import { useTranslation } from 'react-i18next';

export function BrandLocationRemarkController<T extends FieldValues>({
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
          message: t('brand_location.form.remark.error.required'),
        },
      }}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <Textarea
          countCharacters
          enterKeyHint="done"
          disabled={disabled}
          value={value}
          error={error?.message}
          label={!noLabel ? t('brand_location.form.remark.label') : undefined}
          placeholder={t('brand_location.form.remark.placeholder')}
          onChange={onChange}
          onBlur={onBlur}
        />
      )}
    />
  );
}
