import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { Input, onChangeInput } from '@symbiot-core-apps/form-controller';
import { useDebounceValue, useI18n } from '@symbiot-core-apps/shared';
import { usePartnerPromoCodeBenefitsQuery } from '@symbiot-core-apps/api';
import { useEffect } from 'react';

export function BrandPromoCodeController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  noLabel?: boolean;
  onCheckValidity: (valid: boolean) => void;
}) {
  const { t } = useI18n();

  return (
    <Controller
      name={props.name}
      control={props.control}
      rules={{
        required: {
          value: true,
          message: t('brand.form.promo_code.error.required'),
        },
      }}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <PromoCodeInput
          value={value}
          error={error?.message}
          noLabel={props.noLabel}
          onChange={onChange}
          onCheckValidity={props.onCheckValidity}
        />
      )}
    />
  );
}

const PromoCodeInput = ({
  value,
  error,
  noLabel,
  onChange,
  onCheckValidity,
}: {
  value: string;
  error?: string;
  noLabel?: boolean;
  onChange: onChangeInput;
  onCheckValidity: (valid: boolean) => void;
}) => {
  const { t } = useI18n();
  const debouncedValue = useDebounceValue(value, 500);
  const {
    data,
    isPending,
    error: serverError,
  } = usePartnerPromoCodeBenefitsQuery({
    promoCode: debouncedValue,
    enabled: (value || '').length >= 3,
  });

  const benefits = data?.benefits?.join(', ');
  const codeInvalid =
    !isPending && !!serverError && debouncedValue && debouncedValue === value;

  useEffect(() => {
    onCheckValidity(isPending ? false : !!data);
  }, [data, isPending, onCheckValidity]);

  return (
    <Input
      required
      enterKeyHint="done"
      regex={/^[a-zA-Z0-9_]+$/}
      value={value}
      description={
        !isPending && benefits
          ? t('shared.referral_program.promo_includes', { benefits })
          : ''
      }
      label={!noLabel ? t('brand.form.promo_code.label') : ''}
      placeholder={t('brand.form.promo_code.placeholder')}
      error={codeInvalid ? t('brand.form.promo_code.error.invalid') : error}
      onChange={onChange}
    />
  );
};
