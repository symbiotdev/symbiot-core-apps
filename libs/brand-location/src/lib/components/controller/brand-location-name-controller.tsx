import { Control, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useCurrentBrandState } from '@symbiot-core-apps/state';
import { StringController } from '@symbiot-core-apps/form-controller';

export function BrandLocationNameController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  noLabel?: boolean;
  disabled?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();
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
