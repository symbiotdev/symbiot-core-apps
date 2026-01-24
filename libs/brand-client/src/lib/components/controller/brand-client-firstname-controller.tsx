import { StringController } from '@symbiot-core-apps/form-controller';
import { Control, FieldValues, Path } from 'react-hook-form';
import { useI18n } from '@symbiot-core-apps/shared';

export function BrandClientFirstnameController<T extends FieldValues>(props: {
  required?: boolean;
  name: Path<T>;
  control: Control<T>;
  onBlur?: () => void;
}) {
  const { t } = useI18n();

  return (
    <StringController
      maxLength={64}
      label={t('brand_client.form.firstname.label')}
      placeholder={t('brand_client.form.firstname.placeholder')}
      rules={{
        required: {
          value: true,
          message: t('brand_client.form.firstname.error.required'),
        },
      }}
      {...props}
    />
  );
}
