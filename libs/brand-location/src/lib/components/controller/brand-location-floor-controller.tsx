import { Control, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { NumberController } from '@symbiot-core-apps/form-controller';

export function BrandLocationFloorController<T extends FieldValues>(props: {
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
      label={!props.noLabel ? t('brand_location.form.floor.label') : ''}
      placeholder={t('brand_location.form.floor.placeholder')}
      rules={{
        required: {
          value: Boolean(props.required),
          message: t('brand_location.form.floor.error.required'),
        },
      }}
      {...props}
    />
  );
}
