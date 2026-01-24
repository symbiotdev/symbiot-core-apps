import { Control, FieldValues, Path } from 'react-hook-form';
import { NumberController } from '@symbiot-core-apps/form-controller';
import { useI18n } from '@symbiot-core-apps/shared';

export function BrandLocationFloorController<T extends FieldValues>(props: {
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
