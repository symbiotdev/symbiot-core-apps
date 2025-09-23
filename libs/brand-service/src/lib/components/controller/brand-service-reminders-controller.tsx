import { Control, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ToggleController } from '@symbiot-core-apps/form-controller';
import { DateHelper, minutesInDay } from '@symbiot-core-apps/shared';
import { useEffect, useMemo } from 'react';

export function BrandServiceRemindersController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  noLabel?: boolean;
  required?: boolean;
  disabled?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();

  const items = useMemo(
    () =>
      [15, 30, 60, minutesInDay, minutesInDay * 3, minutesInDay * 7].map(
        (minutes) => ({
          label: t('shared.datetime.time_before', {
            value: DateHelper.formatDuration(minutes),
          }),
          value: minutes,
        }),
      ),
    [t],
  );

  useEffect(() => {
    return () => {
      props.onBlur?.();
    };
  }, [props]);

  return (
    <ToggleController
      label={!props.noLabel ? t('brand_service.form.reminders.label') : ''}
      items={items}
      errors={{
        required: t('brand_service.form.reminders.error.required'),
      }}
      {...props}
    />
  );
}
