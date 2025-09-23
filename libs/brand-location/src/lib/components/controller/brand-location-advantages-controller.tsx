import { Control, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useBrandLocationAdvantages } from '@symbiot-core-apps/api';
import { ToggleController } from '@symbiot-core-apps/form-controller';

export function BrandLocationAdvantagesController<
  T extends FieldValues,
>(props: {
  name: Path<T>;
  control: Control<T>;
  showLabel?: boolean;
  required?: boolean;
  disabled?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();
  const { data, isPending, error } = useBrandLocationAdvantages();

  return (
    <ToggleController
      label={props.showLabel ? t('brand_location.form.advantages.label') : ''}
      items={data}
      itemsLoading={isPending}
      itemsError={error}
      errors={{
        required: t('brand_location.form.advantages.error.required'),
      }}
      {...props}
    />
  );
}
