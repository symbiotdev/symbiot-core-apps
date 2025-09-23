import { Control, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useBrandServiceTypesQuery } from '@symbiot-core-apps/api';
import { SelectController } from '@symbiot-core-apps/form-controller';
import { useMemo } from 'react';

export function BrandServiceTypeController<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T>;
  disabled?: boolean;
  withEmpty?: boolean;
  required?: boolean;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();
  const { data, isPending, error } = useBrandServiceTypesQuery();

  const options = useMemo(
    () =>
      data && [
        ...(props.withEmpty
          ? [
              {
                label: '-',
                value: null,
              },
            ]
          : []),
        ...data,
      ],
    [data, props.withEmpty],
  );

  return (
    <SelectController
      {...props}
      label={t('brand_service.form.type.label')}
      placeholder={t('brand_service.form.type.placeholder')}
      options={options}
      optionsLoading={isPending}
      optionsError={error}
      rules={{
        required: {
          value: true,
          message: t('brand_service.form.type.error.required'),
        },
      }}
    />
  );
}
