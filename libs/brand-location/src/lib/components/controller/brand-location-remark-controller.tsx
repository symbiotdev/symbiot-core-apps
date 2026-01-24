import { Control, FieldValues, Path } from 'react-hook-form';
import { TextController } from '@symbiot-core-apps/form-controller';
import { useI18n } from '@symbiot-core-apps/shared';

export function BrandLocationRemarkController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  noLabel?: boolean;
  disabled?: boolean;
  required?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useI18n();

  return (
    <TextController
      label={!props.noLabel ? t('brand_location.form.remark.label') : ''}
      placeholder={t('brand_location.form.remark.placeholder')}
      rules={{
        required: {
          value: Boolean(props.required),
          message: t('brand_location.form.remark.error.required'),
        },
      }}
      {...props}
    />
  );
}
