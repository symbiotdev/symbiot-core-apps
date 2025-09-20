import { Textarea } from '@symbiot-core-apps/ui';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export function BrandAboutController<T extends FieldValues>({
  name,
  control,
  allowEmpty = true,
  noLabel,
  onBlur,
}: {
  name: Path<T>;
  control: Control<T>;
  noLabel?: boolean;
  allowEmpty?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required: {
          value: !allowEmpty,
          message: t('brand.form.about.error.required'),
        },
      }}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <Textarea
          countCharacters
          enterKeyHint="done"
          value={value}
          error={error?.message}
          label={!noLabel ? t('brand.form.about.label') : undefined}
          placeholder={t('brand.form.about.placeholder')}
          onChange={onChange}
          onBlur={onBlur}
        />
      )}
    />
  );
}
