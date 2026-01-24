import { Control, FieldValues, Path } from 'react-hook-form';
import { PriceController } from '@symbiot-core-apps/form-controller';
import {
  BrandMembershipType,
  Currency,
  getTranslateKeyByBrandMembershipType,
} from '@symbiot-core-apps/api';
import { useI18n } from '@symbiot-core-apps/shared';

export function BrandMembershipPriceController<T extends FieldValues>(props: {
  type?: BrandMembershipType;
  name: Path<T>;
  control: Control<T>;
  noLabel?: boolean;
  disabled?: boolean;
  required?: boolean;
  currency?: Currency;
  onBlur?: () => void;
}) {
  const { t } = useI18n();
  const tPrefix = getTranslateKeyByBrandMembershipType(props.type);

  return (
    <PriceController
      {...props}
      label={!props.noLabel ? t(`${tPrefix}.form.price.label`) : ''}
      placeholder={t(`${tPrefix}.form.price.placeholder`)}
      rules={{
        required: {
          value: Boolean(props.required),
          message: t(`${tPrefix}.form.price.error.required`),
        },
      }}
    />
  );
}
