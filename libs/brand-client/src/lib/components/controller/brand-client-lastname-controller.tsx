import { Control, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StringController } from '@symbiot-core-apps/form-controller';

export function BrandClientLastnameController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  required?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();

  return (
    <StringController
      maxLength={64}
      label={t('brand_client.form.lastname.label')}
      placeholder={t('brand_client.form.lastname.placeholder')}
      rules={{
        required: {
          value: true,
          message: t('brand_client.form.lastname.error.required'),
        },
      }}
      {...props}
    />
  );
}
