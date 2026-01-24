import { Control, FieldValues, Path } from 'react-hook-form';
import { TextController } from '@symbiot-core-apps/form-controller';
import {
  BrandMembershipType,
  getTranslateKeyByBrandMembershipType,
} from '@symbiot-core-apps/api';
import { useI18n } from '@symbiot-core-apps/shared';

export function BrandMembershipDescriptionController<
  T extends FieldValues,
>(props: {
  type?: BrandMembershipType;
  name: Path<T>;
  control: Control<T>;
  required?: boolean;
  noLabel?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useI18n();
  const tPrefix = getTranslateKeyByBrandMembershipType(props.type);

  return (
    <TextController
      label={!props.noLabel ? t(`${tPrefix}.form.description.label`) : ''}
      placeholder={t(`${tPrefix}.form.description.placeholder`)}
      rules={{
        required: {
          value: Boolean(props.required),
          message: t(`${tPrefix}.form.description.error.required`),
        },
      }}
      {...props}
    />
  );
}
