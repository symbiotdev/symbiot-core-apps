import { Control, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { InstagramController } from '@symbiot-core-apps/form-controller';

export function BrandInstagramController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  noLabel?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();

  return (
    <InstagramController
      label={!props.noLabel ? t('brand.form.instagram.label') : ''}
      placeholder={t('brand.form.instagram.placeholder')}
      {...props}
    />
  );
}
