import { Control, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { TimezoneController } from '@symbiot-core-apps/form-controller';

export function BrandLocationTimezoneController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  country?: string;
  noLabel?: boolean;
  disabled?: boolean;
  disableDrag?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();

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
