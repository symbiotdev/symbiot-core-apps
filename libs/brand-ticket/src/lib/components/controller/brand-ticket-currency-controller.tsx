import { Control, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useCurrentBrandState } from '@symbiot-core-apps/state';
import { SelectController } from '@symbiot-core-apps/form-controller';

export function BrandTicketCurrencyController<
  T extends FieldValues,
>(props: {
  name: Path<T>;
  control: Control<T>;
  noLabel?: boolean;
  disabled?: boolean;
  disableDrag?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();
  const { brand } = useCurrentBrandState();

  return (
    <SelectController
      label={!props.noLabel ? t('brand_ticket.form.currency.label') : ''}
      placeholder={t('brand_ticket.form.currency.placeholder')}
      options={brand?.currencies}
      rules={{
        required: {
          value: true,
          message: t('brand_ticket.form.currency.error.required'),
        },
      }}
      {...props}
    />
  );
}
