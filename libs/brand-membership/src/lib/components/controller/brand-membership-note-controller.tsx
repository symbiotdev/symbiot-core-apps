import { Control, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { TextController } from '@symbiot-core-apps/form-controller';
import {
  BrandMembershipType,
  getTranslateKeyByBrandMembershipType,
} from '@symbiot-core-apps/api';

export function BrandMembershipNoteController<T extends FieldValues>(props: {
  type?: BrandMembershipType;
  name: Path<T>;
  control: Control<T>;
  noLabel?: boolean;
  disabled?: boolean;
  required?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();
  const tPrefix = getTranslateKeyByBrandMembershipType(props.type);

  return (
    <TextController
      label={!props.noLabel ? t(`${tPrefix}.form.note.label`) : ''}
      placeholder={t(`${tPrefix}.form.note.placeholder`)}
      rules={{
        required: {
          value: Boolean(props.required),
          message: t(`${tPrefix}.form.note.error.required`),
        },
      }}
      {...props}
    />
  );
}
