import { Control, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { PriceController } from '@symbiot-core-apps/form-controller';
import { Currency } from '@symbiot-core-apps/api';

export function BrandServiceDiscountController<T extends FieldValues>(props: {
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

  return (
    <PriceController
      {...props}
      label={!props.noLabel ? t('brand_service.form.discount.label') : ''}
      placeholder={t('brand_service.form.discount.placeholder')}
      rules={{
        required: {
          value: Boolean(props.required),
          message: t('brand_service.form.discount.error.required'),
        },
      }}
    />
  );
}
