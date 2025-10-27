import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { BrandSource } from './brand-source';
import { useTranslation } from 'react-i18next';
import { useAppCompetitorsReq } from '@symbiot-core-apps/api';

export function BrandCompetitorController<T extends FieldValues>({
  name,
  control,
  noLabel,
  onBlur,
}: {
  name: Path<T>;
  control: Control<T>;
  noLabel?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();
  const { data, isPending, error } = useAppCompetitorsReq();

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required: {
          value: true,
          message: t('brand.form.competitor_source.error.required'),
        },
      }}
      render={({ field: { value, onChange } }) => (
        <BrandSource
          label={!noLabel ? t('brand.form.competitor_source.label') : ''}
          placeholder={t('brand.form.competitor_source.placeholder')}
          customPlaceholder={t(
            'brand.form.competitor_source.custom_placeholder',
          )}
          source={value}
          options={data}
          optionsLoading={isPending}
          optionsError={error}
          onUpdate={onChange}
          onBlur={onBlur}
        />
      )}
    />
  );
}
