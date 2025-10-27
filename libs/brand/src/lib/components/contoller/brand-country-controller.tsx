import { useBrandCountriesReq } from '@symbiot-core-apps/api';
import { Control, FieldValues, Path } from 'react-hook-form';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SelectController } from '@symbiot-core-apps/form-controller';

export function BrandCountryController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  noLabel?: boolean;
  disabled?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();
  const { data, isPending, error } = useBrandCountriesReq();

  const options = useMemo(
    () =>
      data?.map((item) => ({
        label: `${item.flag} ${item.label}`,
        value: item.value,
      })),
    [data],
  );

  return (
    <SelectController
      label={!props.noLabel ? t('brand.form.country.label') : ''}
      placeholder={t('brand.form.country.placeholder')}
      options={options}
      optionsLoading={isPending}
      optionsError={error}
      rules={{
        required: {
          value: true,
          message: t('brand.form.country.error.required'),
        },
      }}
      {...props}
    />
  );
}
