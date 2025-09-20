import {
  defaultPageHorizontalPadding,
  ToggleGroup,
} from '@symbiot-core-apps/ui';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useBrandLocationAdvantages } from '@symbiot-core-apps/api';

export function BrandLocationAdvantagesController<T extends FieldValues>({
  name,
  control,
  disabled,
  noLabel,
  required,
}: {
  name: Path<T>;
  control: Control<T>;
  noLabel?: boolean;
  required?: boolean;
  disabled?: boolean;
}) {
  const { t } = useTranslation();
  const { data, isPending, error } = useBrandLocationAdvantages();

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        validate: (value) =>
          !required
            ? true
            : Array.isArray(value) && value.length
              ? true
              : t('brand.form.advantages.error.required'),
      }}
      render={({ field: { value, onChange } }) => (
        <ToggleGroup
          allowEmpty
          multiselect
          disabled={disabled}
          viewProps={{
            backgroundColor: '$background1',
            borderRadius: '$10',
            paddingHorizontal: defaultPageHorizontalPadding,
          }}
          label={
            !noLabel ? t('brand_location.form.advantages.label') : undefined
          }
          items={data}
          loading={isPending}
          error={error}
          value={value}
          onChange={onChange}
        />
      )}
    />
  );
}
