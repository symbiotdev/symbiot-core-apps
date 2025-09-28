import { Control, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { TextController } from '@symbiot-core-apps/form-controller';

export function BrandMembershipNoteController<T extends FieldValues>(props: {
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
      label={!props.noLabel ? t('brand_membership.form.note.label') : ''}
      placeholder={t('brand_membership.form.note.placeholder')}
      rules={{
        required: {
          value: Boolean(props.required),
          message: t('brand_membership.form.note.error.required'),
        },
      }}
      {...props}
    />
  );
}
