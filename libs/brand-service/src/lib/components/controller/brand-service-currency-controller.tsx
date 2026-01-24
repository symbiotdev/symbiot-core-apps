import { Control, FieldValues, Path } from 'react-hook-form';
import { useCurrentBrandState } from '@symbiot-core-apps/state';
import { SelectController } from '@symbiot-core-apps/form-controller';
import { useI18n } from '@symbiot-core-apps/shared';

export function BrandServiceCurrencyController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  noLabel?: boolean;
  disabled?: boolean;
  disableDrag?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useI18n();
  const { brand } = useCurrentBrandState();

  return (
    <SelectController
      label={!props.noLabel ? t('brand_service.form.currency.label') : ''}
      placeholder={t('brand_service.form.currency.placeholder')}
      options={brand?.currencies}
      rules={{
        required: {
          value: true,
          message: t('brand_service.form.currency.error.required'),
        },
      }}
      {...props}
    />
  );
}
