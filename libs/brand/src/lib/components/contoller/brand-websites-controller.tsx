import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { isValidURL } from '@symbiot-core-apps/shared';
import { WebsiteInput } from '@symbiot-core-apps/ui';

export function BrandWebsitesController<T extends FieldValues>({
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
      name={name}
      control={control}
      rules={{
        validate: (value) =>
          (allowEmpty && !value) || (value && isValidURL(value))
            ? true
            : t('brand.form.website.error.validation'),
      }}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <WebsiteInput
          enterKeyHint="done"
          value={value}
          label={!noLabel ? t('brand.form.website.label') : ''}
          placeholder={t('brand.form.website.placeholder')}
          error={error?.message}
          onChange={onChange}
          onBlur={onBlur}
        />
      )}
    />
  );
}
