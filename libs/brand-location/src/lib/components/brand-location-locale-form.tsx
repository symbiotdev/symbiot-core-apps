import { Controller, useForm } from 'react-hook-form';
import {
  CountryPicker,
  CurrencyPicker,
  TimezonePicker,
  UsStatePicker,
} from '@symbiot-core-apps/ui';
import { CountryCode } from 'countries-and-timezones';
import {
  BrandLocation,
  useUpdateBrandLocationQuery,
} from '@symbiot-core-apps/api';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useBrandLocationForm } from '../hooks/use-brand-location-form';

export const BrandLocationLocaleForm = ({
  location,
}: {
  location: BrandLocation;
}) => {
  const { mutateAsync: update } = useUpdateBrandLocationQuery();
  const form = useBrandLocationForm();

  const { control: countryControl, watch: countryWatch } = useForm<{
    country: string;
  }>({
    defaultValues: {
      country: location.country,
    },
    resolver: yupResolver(
      yup
        .object()
        .shape({
          country: form.country.scheme,
        })
        .required(),
    ),
  });

  const { control: usStateControl } = useForm<{
    usState: string;
  }>({
    defaultValues: {
      usState: location.usState,
    },
    resolver: yupResolver(
      yup
        .object()
        .shape({
          usState: form.usState.scheme,
        })
        .required(),
    ),
  });

  const { control: currencyControl } = useForm<{
    currency: string;
  }>({
    defaultValues: {
      currency: location.currency,
    },
    resolver: yupResolver(
      yup
        .object()
        .shape({
          currency: form.currency.scheme,
        })
        .required(),
    ),
  });

  const { control: timezoneControl } = useForm<{
    timezone: string;
  }>({
    defaultValues: {
      timezone: location.timezone,
    },
    resolver: yupResolver(
      yup
        .object()
        .shape({
          timezone: form.timezone.scheme,
        })
        .required(),
    ),
  });

  return (
    <>
      <Controller
        control={countryControl}
        name="country"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <CountryPicker
            value={value as CountryCode}
            error={error?.message}
            label={form.country.label}
            sheetLabel={form.country.sheetLabel}
            placeholder={form.country.placeholder}
            onChange={(country) => {
              onChange(country);
              country !== location.country &&
                update({
                  id: location.id,
                  data: { country },
                });
            }}
          />
        )}
      />

      {countryWatch().country?.toLowerCase() === 'us' && (
        <Controller
          control={usStateControl}
          name="usState"
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <UsStatePicker
              value={value as string}
              error={error?.message}
              label={form.usState.label}
              sheetLabel={form.usState.sheetLabel}
              placeholder={form.usState.placeholder}
              onChange={(usState) => {
                onChange(usState);
                usState !== location.usState &&
                  update({
                    id: location.id,
                    data: { usState },
                  });
              }}
            />
          )}
        />
      )}

      <Controller
        control={timezoneControl}
        name="timezone"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <TimezonePicker
            onlyCountryTimezones
            country={countryWatch().country as CountryCode}
            value={value}
            error={error?.message}
            label={form.timezone.label}
            sheetLabel={form.timezone.sheetLabel}
            placeholder={form.timezone.placeholder}
            onChange={(timezone) => {
              onChange(timezone);
              timezone !== location.timezone &&
                update({
                  id: location.id,
                  data: { timezone },
                });
            }}
          />
        )}
      />

      <Controller
        control={currencyControl}
        name="currency"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <CurrencyPicker
            value={value as string}
            error={error?.message}
            label={form.currency.label}
            sheetLabel={form.currency.sheetLabel}
            placeholder={form.currency.placeholder}
            onChange={(currency) => {
              onChange(currency);
              currency !== location.currency &&
                update({
                  id: location.id,
                  data: { currency },
                });
            }}
          />
        )}
      />
    </>
  );
};
