import { Control, FieldValues, Path } from 'react-hook-form';
import { StringController } from '@symbiot-core-apps/form-controller';
import {
  BrandMembershipType,
  getTranslateKeyByBrandMembershipType,
} from '@symbiot-core-apps/api';
import { useI18n } from '@symbiot-core-apps/shared';

export function BrandMembershipNameController<T extends FieldValues>(props: {
  type?: BrandMembershipType;
  name: Path<T>;
  control: Control<T>;
  required?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useI18n();
  const tPrefix = getTranslateKeyByBrandMembershipType(props.type);

  return (
    <StringController
      maxLength={64}
      label={t(`${tPrefix}.form.name.label`)}
      placeholder={t(`${tPrefix}.form.name.placeholder`)}
      rules={{
        required: {
          value: true,
          message: t(`${tPrefix}.form.name.error.required`),
        },
      }}
      {...props}
    />
  );
}
