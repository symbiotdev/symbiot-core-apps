import { Control, FieldValues, Path } from 'react-hook-form';
import { useCurrentBrandState } from '@symbiot-core-apps/state';
import { StringController } from '@symbiot-core-apps/form-controller';
import { useI18n } from '@symbiot-core-apps/shared';

export function BrandLocationNameController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  noLabel?: boolean;
  disabled?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useI18n();
  const { brand } = useCurrentBrandState();

  return (
    <StringController
      label={!props.noLabel ? t('brand_location.form.name.label') : ''}
      placeholder={t('brand_location.form.name.placeholder', {
        brandName: brand?.name,
      })}
      rules={{
        required: {
          value: true,
          message: t('brand_location.form.name.error.required'),
        },
      }}
      {...props}
    />
  );
}
