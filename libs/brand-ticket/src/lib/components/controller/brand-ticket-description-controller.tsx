import { Control, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { TextController } from '@symbiot-core-apps/form-controller';

export function BrandTicketDescriptionController<
  T extends FieldValues,
>(props: {
  name: Path<T>;
  control: Control<T>;
  required?: boolean;
  noLabel?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();

  return (
    <TextController
      label={!props.noLabel ? t('brand_ticket.form.description.label') : ''}
      placeholder={t('brand_ticket.form.description.placeholder')}
      rules={{
        required: {
          value: Boolean(props.required),
          message: t('brand_ticket.form.description.error.required'),
        },
      }}
      {...props}
    />
  );
}
