import { Control, FieldValues, Path } from 'react-hook-form';
import { TextController } from '@symbiot-core-apps/form-controller';
import { useI18n } from '@symbiot-core-apps/shared';

export function BrandAboutController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  noLabel?: boolean;
  required?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useI18n();

  return (
    <TextController
      label={!props.noLabel ? t('brand.form.about.label') : ''}
      placeholder={t('brand.form.about.placeholder')}
      rules={{
        required: {
          value: Boolean(props.required),
          message: t('brand.form.about.error.required'),
        },
      }}
      {...props}
    />
  );
}
