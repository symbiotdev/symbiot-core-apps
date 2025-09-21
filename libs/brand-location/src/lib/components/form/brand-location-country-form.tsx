import { useForm } from 'react-hook-form';
import { useCallback } from 'react';
import { BrandLocationCountryController } from '../controller/brand-location-country-controller';
import { BrandLocationUsStateController } from '../controller/brand-location-us-state-controller';
import states from 'states-us';

type FormValue = {
  country: string;
  usState: string | null;
};

export const BrandLocationCountryForm = ({
  country,
  usState,
  onUpdate,
}: FormValue & {
  onUpdate: (value: FormValue) => void;
}) => {
  const { control, handleSubmit, setValue } = useForm<FormValue>({
    defaultValues: {
      country,
      usState,
    },
  });

  const update = useCallback(
    (value: FormValue) => {
      if (country === value.country && usState === value.usState) return;

      const isUsSelected = value.country.toLowerCase() === 'us';

      const adjustedValue = {
        country: value.country,
        usState:
          isUsSelected && !value.usState
            ? states[0].abbreviation
            : !isUsSelected
              ? null
              : value.usState,
      };

      setValue('country', adjustedValue.country);
      setValue('usState', adjustedValue.usState);

      onUpdate(adjustedValue);
    },
    [country, onUpdate, setValue, usState],
  );

  return (
    <>
      <BrandLocationCountryController
        disableDrag
        name="country"
        control={control}
        onBlur={handleSubmit(update)}
      />

      {country.toLowerCase() === 'us' && (
        <BrandLocationUsStateController
          disableDrag
          name="usState"
          control={control}
          onBlur={handleSubmit(update)}
        />
      )}
    </>
  );
};
