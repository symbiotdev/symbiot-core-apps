import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { BrandSource } from './brand-source';
import { useAppReferralsReq } from '@symbiot-core-apps/api';
import { useI18n } from '@symbiot-core-apps/shared';

export function BrandReferralSourceController<T extends FieldValues>({
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
  const { t } = useI18n();
  const { data, isPending, error } = useAppReferralsReq();

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required: {
          value: true,
          message: t('brand.form.referral_source.error.required'),
        },
      }}
      render={({ field: { value, onChange } }) => (
        <BrandSource
          label={!noLabel ? t('brand.form.referral_source.label') : ''}
          placeholder={t('brand.form.referral_source.placeholder')}
          customPlaceholder={t('brand.form.referral_source.custom_placeholder')}
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
