import { Control, FieldValues, Path } from 'react-hook-form';
import { StringController } from '@symbiot-core-apps/form-controller';
import { useI18n } from '@symbiot-core-apps/shared';

export function BrandLocationEntranceController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  noLabel?: boolean;
  disabled?: boolean;
  required?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useI18n();

  return (
    <StringController
      label={!props.noLabel ? t('brand_location.form.entrance.label') : ''}
      placeholder={t('brand_location.form.entrance.placeholder')}
      rules={{
        required: {
          value: Boolean(props.required),
          message: t('brand_location.form.entrance.error.required'),
        },
      }}
      {...props}
    />
  );
}
