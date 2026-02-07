import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { Input, onChangeInput } from '@symbiot-core-apps/form-controller';
import { useDebounceValue, useI18n } from '@symbiot-core-apps/shared';
import { usePartnerPromoCodeBenefitsQuery } from '@symbiot-core-apps/api';
import { useEffect } from 'react';

export function PromoCodeController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  noLabel?: boolean;
  autofocus?: boolean;
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
          message: t(
            'shared.partner_program.promo_code.form.code.error.required',
          ),
        },
      }}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <PromoCodeInput
          value={value}
          error={error?.message}
          noLabel={props.noLabel}
          autofocus={props.autofocus}
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
  autofocus,
  onChange,
  onCheckValidity,
}: {
  value: string;
  error?: string;
  noLabel?: boolean;
  autofocus?: boolean;
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
      autofocus={autofocus}
      description={
        !isPending && benefits
          ? t('shared.partner_program.promo_code.includes', { benefits })
          : ''
      }
      label={
        !noLabel ? t('shared.partner_program.promo_code.form.code.label') : ''
      }
      placeholder={t(
        'shared.partner_program.promo_code.form.code.placeholder',
      )}
      error={
        codeInvalid
          ? t('shared.partner_program.promo_code.form.code.error.invalid')
          : error
      }
      onChange={onChange}
    />
  );
};
