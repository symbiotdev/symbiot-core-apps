import { Control, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { InstagramController } from '@symbiot-core-apps/form-controller';

export function BrandLocationInstagramController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  noLabel?: boolean;
  disabled?: boolean;
  required?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();

  return (
    <InstagramController
      label={!props.noLabel ? t('brand_location.form.instagram.label') : ''}
      placeholder={t('brand_location.form.instagram.placeholder')}
      rules={{
        required: {
          value: Boolean(props.required),
          message: t('brand_location.form.instagram.error.required'),
        },
      }}
      {...props}
    />
  );
}
