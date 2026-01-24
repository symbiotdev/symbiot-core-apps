import { Control, FieldValues, Path } from 'react-hook-form';
import { TextController } from '@symbiot-core-apps/form-controller';
import { useI18n } from '@symbiot-core-apps/shared';

export function BrandServiceDescriptionController<
  T extends FieldValues,
>(props: {
  name: Path<T>;
  control: Control<T>;
  required?: boolean;
  noLabel?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useI18n();

  return (
    <TextController
      label={!props.noLabel ? t('brand_service.form.description.label') : ''}
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
