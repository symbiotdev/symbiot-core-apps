import { Control, FieldValues, Path } from 'react-hook-form';
import { NumberController } from '@symbiot-core-apps/form-controller';
import {
  BrandMembershipType,
  getTranslateKeyByBrandMembershipType,
} from '@symbiot-core-apps/api';
import { useI18n } from '@symbiot-core-apps/shared';

export function BrandMembershipVisitsController<T extends FieldValues>(props: {
  type?: BrandMembershipType;
  name: Path<T>;
  control: Control<T>;
  noLabel?: boolean;
  disabled?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useI18n();
  const tPrefix = getTranslateKeyByBrandMembershipType(props.type);

  return (
    <NumberController
      maxLength={3}
      label={!props.noLabel ? t(`${tPrefix}.form.visits.label`) : ''}
      placeholder={t(`${tPrefix}.form.visits.placeholder`)}
      rules={{
        required: {
          value: true,
          message: t(`${tPrefix}.form.visits.error.required`),
        },
      }}
      {...props}
    />
  );
}
