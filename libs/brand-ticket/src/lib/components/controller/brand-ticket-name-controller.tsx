import { Control, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StringController } from '@symbiot-core-apps/form-controller';

export function BrandTicketNameController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  required?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();

  return (
    <StringController
      maxLength={64}
      label={t('brand_ticket.form.name.label')}
      placeholder={t('brand_ticket.form.name.placeholder')}
      rules={{
        required: {
          value: true,
          message: t('brand_ticket.form.name.error.required'),
        },
      }}
      {...props}
    />
  );
}
