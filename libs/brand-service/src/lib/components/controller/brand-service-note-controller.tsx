import { Control, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { TextController } from '@symbiot-core-apps/form-controller';

export function BrandServiceNoteController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  noLabel?: boolean;
  disabled?: boolean;
  required?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();

  return (
    <TextController
      label={!props.noLabel ? t('brand_service.form.note.label') : ''}
      placeholder={t('brand_service.form.note.placeholder')}
      rules={{
        required: {
          value: Boolean(props.required),
          message: t('brand_service.form.note.error.required'),
        },
      }}
      {...props}
    />
  );
}
