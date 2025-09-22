import { Control, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { PromoCodeController } from '@symbiot-core-apps/form-controller';

export function BrandPromoCodeController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  noLabel?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();

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
