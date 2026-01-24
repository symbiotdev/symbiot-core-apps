import { Control, FieldValues, Path } from 'react-hook-form';
import { DateHelper, minutesInDay, useI18n } from '@symbiot-core-apps/shared';
import { useEffect, useMemo } from 'react';
import { ToggleController } from '@symbiot-core-apps/form-controller';

export function BrandBookingRemindersController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  label: string;
  required?: boolean;
  disabled?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useI18n();

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

  return <ToggleController items={items} {...props} />;
}
