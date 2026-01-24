import { Control, FieldValues, Path } from 'react-hook-form';
import { NumberController } from '@symbiot-core-apps/form-controller';
import { useI18n } from '@symbiot-core-apps/shared';

export function BrandServicePlacesController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  noLabel?: boolean;
  disabled?: boolean;
  required?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useI18n();

  return (
    <NumberController
      maxLength={3}
      label={!props.noLabel ? t('brand_service.form.places.label') : ''}
      placeholder={t('brand_service.form.places.placeholder')}
      rules={{
        required: {
          value: true,
          message: t('brand_service.form.places.error.required'),
        },
      }}
      {...props}
    />
  );
}
