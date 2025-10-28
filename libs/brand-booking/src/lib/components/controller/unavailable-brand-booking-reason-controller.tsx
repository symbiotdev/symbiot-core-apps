import { Control, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { TextController } from '@symbiot-core-apps/form-controller';

export function UnavailableBrandBookingReasonController<
  T extends FieldValues,
>(props: {
  name: Path<T>;
  control: Control<T>;
  noLabel?: boolean;
  disabled?: boolean;
  required?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();

  return (
    <TextController
      {...props}
      label={
        !props.noLabel ? t(`unavailable_brand_booking.form.reason.label`) : ''
      }
      placeholder={t(`unavailable_brand_booking.form.reason.placeholder`)}
      rules={{
        required: {
          value: Boolean(props.required),
          message: t(`unavailable_brand_booking.form.reason.error.required`),
        },
      }}
    />
  );
}
