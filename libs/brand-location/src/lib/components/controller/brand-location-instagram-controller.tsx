import { Control, FieldValues, Path } from 'react-hook-form';
import { InstagramController } from '@symbiot-core-apps/form-controller';
import { useI18n } from '@symbiot-core-apps/shared';

export function BrandLocationInstagramController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  noLabel?: boolean;
  disabled?: boolean;
  required?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useI18n();

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
