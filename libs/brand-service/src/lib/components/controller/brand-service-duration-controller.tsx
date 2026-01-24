import { Control, FieldValues, Path } from 'react-hook-form';
import { DurationController } from '@symbiot-core-apps/form-controller';
import { useI18n } from '@symbiot-core-apps/shared';

export function BrandServiceDurationController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  noLabel?: boolean;
  disabled?: boolean;
  required?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useI18n();

  return (
    <DurationController
      units={['hours', 'minutes']}
      label={!props.noLabel ? t('brand_service.form.duration.label') : ''}
      placeholder={t('brand_service.form.duration.placeholder')}
      rules={{
        required: {
          value: true,
          message: t('brand_service.form.duration.error.required'),
        },
      }}
      {...props}
    />
  );
}
