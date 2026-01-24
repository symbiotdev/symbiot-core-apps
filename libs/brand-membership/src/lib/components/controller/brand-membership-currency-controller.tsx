import { Control, FieldValues, Path } from 'react-hook-form';
import { useCurrentBrandState } from '@symbiot-core-apps/state';
import { SelectController } from '@symbiot-core-apps/form-controller';
import {
  BrandMembershipType,
  getTranslateKeyByBrandMembershipType,
} from '@symbiot-core-apps/api';
import { useI18n } from '@symbiot-core-apps/shared';

export function BrandMembershipCurrencyController<
  T extends FieldValues,
>(props: {
  name: Path<T>;
  type?: BrandMembershipType;
  control: Control<T>;
  noLabel?: boolean;
  disabled?: boolean;
  disableDrag?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useI18n();
  const { brand } = useCurrentBrandState();
  const tPrefix = getTranslateKeyByBrandMembershipType(props.type);

  return (
    <SelectController
      label={!props.noLabel ? t(`${tPrefix}.form.currency.label`) : ''}
      placeholder={t(`${tPrefix}.form.currency.placeholder`)}
      options={brand?.currencies}
      rules={{
        required: {
          value: true,
          message: t(`${tPrefix}.form.currency.error.required`),
        },
      }}
      {...props}
    />
  );
}
