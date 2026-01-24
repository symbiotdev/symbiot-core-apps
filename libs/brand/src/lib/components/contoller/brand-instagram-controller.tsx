import { Control, FieldValues, Path } from 'react-hook-form';
import { InstagramController } from '@symbiot-core-apps/form-controller';
import { useI18n } from '@symbiot-core-apps/shared';

export function BrandInstagramController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  noLabel?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useI18n();

  return (
    <InstagramController
      label={!props.noLabel ? t('brand.form.instagram.label') : ''}
      placeholder={t('brand.form.instagram.placeholder')}
      {...props}
    />
  );
}
