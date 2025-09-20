import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { InstagramInput } from '@symbiot-core-apps/ui';

export function BrandInstagramsController<T extends FieldValues>({
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
      name={name}
      control={control}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <InstagramInput
          enterKeyHint="done"
          value={value}
          label={!noLabel ? t('brand.form.instagrams.label') : ''}
          placeholder={t('brand.form.instagrams.placeholder')}
          error={error?.message}
          onChange={onChange}
          onBlur={onBlur}
        />
      )}
    />
  );
}
