import { Control, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { PriceController } from '@symbiot-core-apps/form-controller';
import {
  BrandMembershipType,
  Currency,
  getTranslateKeyByBrandMembershipType,
} from '@symbiot-core-apps/api';

export function BrandMembershipDiscountController<
  T extends FieldValues,
>(props: {
  type?: BrandMembershipType;
  name: Path<T>;
  control: Control<T>;
  noLabel?: boolean;
  disabled?: boolean;
  required?: boolean;
  max?: number;
  currency?: Currency;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();
  const tPrefix = getTranslateKeyByBrandMembershipType(props.type);

  return (
    <PriceController
      {...props}
      label={!props.noLabel ? t(`${tPrefix}.form.discount.label`) : ''}
      placeholder={t(`${tPrefix}.form.discount.placeholder`)}
      rules={{
        required: {
          value: Boolean(props.required),
          message: t(`${tPrefix}.form.discount.error.required`),
        },
      }}
    />
  );
}
