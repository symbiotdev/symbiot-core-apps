import { Control, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { TextController } from '@symbiot-core-apps/form-controller';

export function BrandAboutController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  noLabel?: boolean;
  required?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();

  return (
    <TextController
      label={!props.noLabel ? t('brand.form.about.label') : ''}
      placeholder={t('brand.form.about.placeholder')}
      rules={{
        required: {
          value: !props.required,
          message: t('brand.form.about.error.required'),
        },
      }}
      {...props}
    />
  );
}
