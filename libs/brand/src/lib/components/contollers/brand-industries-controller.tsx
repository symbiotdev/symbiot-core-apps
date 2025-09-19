import { BrandIndustry, useBrandIndustriesQuery } from '@symbiot-core-apps/api';
import { SelectPicker } from '@symbiot-core-apps/ui';
import { Controller, useForm } from 'react-hook-form';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { arraysOfObjectsEqual } from '@symbiot-core-apps/shared';

type FormValue = {
  industries: BrandIndustry[];
};

export const BrandIndustriesController = ({
  industries,
  onUpdate,
}: FormValue & {
  onUpdate: (props: { industries: string[] }) => void;
}) => {
  const { t } = useTranslation();
  const {
    data,
    isPending: industriesLoading,
    error: industriesError,
  } = useBrandIndustriesQuery();

  const { control, handleSubmit, setValue } = useForm<{
    industry: string | null;
  }>({
    defaultValues: {
      industry: industries[0]?.value,
    },
  });

  const update = useCallback(
    ({ industry }: { industry: string | null }) => {
      if (!industry || arraysOfObjectsEqual([industry], industries)) return;

      onUpdate({ industries: [industry] });
    },
    [industries, onUpdate],
  );

  useEffect(() => {
    setValue('industry', industries[0]?.value || null);
  }, [setValue, industries]);

  return (
    <Controller
      control={control}
      name="industry"
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <SelectPicker
          value={value as string}
          error={error?.message}
          options={data}
          optionsLoading={industriesLoading}
          optionsError={industriesError}
          label={t('brand.form.industry.label')}
          sheetLabel={t('brand.form.industry.label')}
          placeholder={t('brand.form.industry.placeholder')}
          onChange={(industry) => {
            onChange(industry);
            handleSubmit(update)();
          }}
        />
      )}
    />
  );
};
