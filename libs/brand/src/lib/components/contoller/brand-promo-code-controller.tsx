import { Control, FieldValues, Path } from 'react-hook-form';
import { PromoCodeController } from '@symbiot-core-apps/form-controller';
import { useI18n } from '@symbiot-core-apps/shared';

export function BrandPromoCodeController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  noLabel?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useI18n();

  return (
    <PromoCodeController
      label={!props.noLabel ? t('brand.form.promo_code.label') : ''}
      placeholder={t('brand.form.promo_code.placeholder')}
      rules={{
        required: {
          value: true,
          message: t('brand.form.promo_code.error.required'),
        },
      }}
      {...props}
    />
  );
}
