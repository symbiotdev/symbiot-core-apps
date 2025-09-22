import { Control, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { NameController } from '@symbiot-core-apps/form-controller';

export function BrandNameController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  noLabel?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();

  return (
    <NameController
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
