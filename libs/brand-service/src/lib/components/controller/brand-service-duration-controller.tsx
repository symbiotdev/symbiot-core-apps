import { Control, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { DurationController } from '@symbiot-core-apps/form-controller';

export function BrandServiceDurationController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  noLabel?: boolean;
  disabled?: boolean;
  required?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();

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
