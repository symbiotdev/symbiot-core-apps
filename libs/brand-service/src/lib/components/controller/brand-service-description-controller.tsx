import { Control, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { TextController } from '@symbiot-core-apps/form-controller';

export function BrandServiceDescriptionController<
  T extends FieldValues,
>(props: {
  name: Path<T>;
  control: Control<T>;
  required?: boolean;
  showLabel?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();

  return (
    <TextController
      label={props.showLabel ? t('brand_service.form.description.label') : ''}
      placeholder={t('brand_service.form.description.placeholder')}
      rules={{
        required: {
          value: Boolean(props.required),
          message: t('brand_service.form.description.error.required'),
        },
      }}
      {...props}
    />
  );
}
