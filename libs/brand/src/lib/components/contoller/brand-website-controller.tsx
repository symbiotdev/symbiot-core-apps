import { Control, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { WebsiteController } from '@symbiot-core-apps/form-controller';

export function BrandWebsiteController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  noLabel?: boolean;
  required?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();

  return (
    <WebsiteController
      label={!props.noLabel ? t('brand.form.website.label') : ''}
      placeholder={t('brand.form.website.placeholder')}
      errors={{
        validation: t('brand.form.website.error.validation'),
      }}
      {...props}
    />
  );
}
