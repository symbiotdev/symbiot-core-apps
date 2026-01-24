import { useBrandCurrenciesReq } from '@symbiot-core-apps/api';
import { Control, FieldValues, Path } from 'react-hook-form';
import { SelectController } from '@symbiot-core-apps/form-controller';
import { useI18n } from '@symbiot-core-apps/shared';

export function BrandCurrencyController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  noLabel?: boolean;
  disabled?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useI18n();
  const { data, isPending, error } = useBrandCurrenciesReq();

  return (
    <SelectController
      label={!props.noLabel ? t('brand.form.currency.label') : ''}
      placeholder={t('brand.form.currency.placeholder')}
      options={data}
      optionsLoading={isPending}
      optionsError={error}
      rules={{
        required: {
          value: true,
          message: t('brand.form.currency.error.required'),
        },
      }}
      {...props}
    />
  );
}
