import { useBrandIndustriesReq } from '@symbiot-core-apps/api';
import { Control, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SelectController } from '@symbiot-core-apps/form-controller';

export function BrandIndustryController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  noLabel?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();
  const { data, isPending, error } = useBrandIndustriesReq();

  return (
    <SelectController
      options={data}
      optionsLoading={isPending}
      optionsError={error}
      label={!props.noLabel ? t('brand.form.industry.label') : ''}
      placeholder={t('brand.form.industry.placeholder')}
      rules={{
        required: {
          value: true,
          message: t('brand.form.industry.error.required'),
        },
      }}
      {...props}
    />
  );
}
