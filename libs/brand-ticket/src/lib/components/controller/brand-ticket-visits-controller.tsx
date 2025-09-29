import { Control, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SelectController } from '@symbiot-core-apps/form-controller';
import { useMemo } from 'react';

export function BrandTicketVisitsController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  noLabel?: boolean;
  disabled?: boolean;
  disableDrag?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();

  const options = useMemo(
    () =>
      Array.from({ length: 100 }).map((_, i) => {
        const value = i + 1;

        return {
          label: String(value),
          value,
        };
      }),
    [],
  );

  return (
    <SelectController
      label={!props.noLabel ? t('brand_ticket.form.visits.label') : ''}
      placeholder={t('brand_ticket.form.visits.placeholder')}
      options={options}
      rules={{
        required: {
          value: true,
          message: t('brand_ticket.form.visits.error.required'),
        },
      }}
      {...props}
    />
  );
}
