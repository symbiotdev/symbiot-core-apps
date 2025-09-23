import { Control, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { NumberController } from '@symbiot-core-apps/form-controller';

export function BrandServicePlacesController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  noLabel?: boolean;
  disabled?: boolean;
  required?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();

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
