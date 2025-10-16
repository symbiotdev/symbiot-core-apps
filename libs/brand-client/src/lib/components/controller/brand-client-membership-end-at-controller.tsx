import { Control, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { DateController } from '@symbiot-core-apps/form-controller';
import { DateHelper } from '@symbiot-core-apps/shared';

export function BrandClientBirthdayController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  disabled?: boolean;
  noLabel?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();

  return (
    <DateController
      minDate={DateHelper.addDays(new Date(), -1)}
      label={
        props.noLabel ? '' : t('brand_client_membership.form.end_at.label')
      }
      placeholder={t('brand_client_membership.form.end_at.placeholder')}
      {...props}
    />
  );
}
