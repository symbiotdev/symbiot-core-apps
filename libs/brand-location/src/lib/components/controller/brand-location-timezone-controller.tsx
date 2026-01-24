import { Control, FieldValues, Path } from 'react-hook-form';
import { TimezoneController } from '@symbiot-core-apps/form-controller';
import { useI18n } from '@symbiot-core-apps/shared';

export function BrandLocationTimezoneController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  country?: string;
  noLabel?: boolean;
  disabled?: boolean;
  disableDrag?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useI18n();

  return (
    <TimezoneController
      label={!props.noLabel ? t('brand_location.form.timezone.label') : ''}
      placeholder={t('brand_location.form.timezone.placeholder')}
      rules={{
        required: {
          value: true,
          message: t('brand_location.form.timezone.error.required'),
        },
      }}
      {...props}
    />
  );
}
