import { Control, FieldValues, Path } from 'react-hook-form';
import { StringController } from '@symbiot-core-apps/form-controller';
import { useI18n } from '@symbiot-core-apps/shared';

export function BrandNameController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  noLabel?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useI18n();

  return (
    <StringController
      label={!props.noLabel ? t('brand.form.name.label') : ''}
      placeholder={t('brand.form.name.placeholder')}
      rules={{
        required: {
          value: true,
          message: t('brand.form.name.error.required'),
        },
      }}
      {...props}
    />
  );
}
