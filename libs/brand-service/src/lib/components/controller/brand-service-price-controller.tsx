import { Control, FieldValues, Path } from 'react-hook-form';
import { PriceController } from '@symbiot-core-apps/form-controller';
import { Currency } from '@symbiot-core-apps/api';
import { useI18n } from '@symbiot-core-apps/shared';

export function BrandServicePriceController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  noLabel?: boolean;
  disabled?: boolean;
  required?: boolean;
  currency?: Currency;
  onBlur?: () => void;
}) {
  const { t } = useI18n();

  return (
    <PriceController
      {...props}
      label={!props.noLabel ? t('brand_service.form.price.label') : ''}
      placeholder={t('brand_service.form.price.placeholder')}
      rules={{
        required: {
          value: Boolean(props.required),
          message: t('brand_service.form.price.error.required'),
        },
      }}
    />
  );
}
