import { useMemo } from 'react';
import * as yup from 'yup';
import { object } from 'yup';
import { useTranslation } from 'react-i18next';
import { useCurrentBrandState } from '@symbiot-core-apps/state';
import states from 'states-us';
import { countryToCurrency } from '@symbiot-core-apps/shared';
import {
  getAppLinkSchema,
  getPhoneInputSchema,
  getWeekdayScheduleScheme,
  phoneDefaultValue,
} from '@symbiot-core-apps/ui';
import { CountryCode, getCountry } from 'countries-and-timezones';

const defaultState = states[0].abbreviation;
const defaultCountryCode = Intl?.DateTimeFormat()
  ?.resolvedOptions()
  ?.locale?.split('-')?.[1];

export const useBrandLocationForm = () => {
  const { t } = useTranslation();
  const { brand } = useCurrentBrandState();

  return useMemo(
    () => ({
      name: {
        title: t('brand.locations.upsert.form.name.title'),
        subtitle: t('brand.locations.upsert.form.name.subtitle'),
        label: t('brand.locations.upsert.form.name.label'),
        placeholder: t('brand.locations.upsert.form.name.placeholder', {
          brandName: brand?.name,
        }),
        scheme: yup
          .string()
          .required(t('brand.locations.upsert.form.name.error.required')),
      },
      country: {
        defaultValue: getCountry(defaultCountryCode as CountryCode)
          ? defaultCountryCode
          : undefined,
        title: t('brand.locations.upsert.form.country.title'),
        subtitle: t('brand.locations.upsert.form.country.subtitle'),
        sheetLabel: t('shared.country'),
        label: t('brand.locations.upsert.form.country.label'),
        placeholder: t('brand.locations.upsert.form.country.placeholder'),
        scheme: yup
          .string()
          .required(t('brand.locations.upsert.form.country.error.required')),
      },
      timezone: {
        defaultValue: 'UTC',
        title: t('brand.locations.upsert.form.timezone.title'),
        subtitle: t('brand.locations.upsert.form.timezone.subtitle'),
        sheetLabel: t('shared.timezone'),
        label: t('brand.locations.upsert.form.timezone.label'),
        placeholder: t('brand.locations.upsert.form.timezone.placeholder'),
        scheme: yup
          .string()
          .required(t('brand.locations.upsert.form.timezone.error.required')),
      },
      usState: {
        defaultValue: defaultState,
        label: t('brand.locations.upsert.form.us_state.label'),
        sheetLabel: t('brand.locations.upsert.form.us_state.sheet_label'),
        placeholder: t('brand.locations.upsert.form.us_state.placeholder'),
        scheme: yup
          .string()
          .required(t('brand.locations.upsert.form.us_state.error.required')),
      },
      currency: {
        title: t('brand.locations.upsert.form.currency.title'),
        subtitle: t('brand.locations.upsert.form.currency.subtitle'),
        sheetLabel: t('shared.currency'),
        defaultValue: defaultCountryCode
          ? countryToCurrency[defaultCountryCode]
          : undefined,
        label: t('brand.locations.upsert.form.currency.label'),
        placeholder: t('brand.locations.upsert.form.currency.placeholder'),
        scheme: yup
          .string()
          .required(t('brand.locations.upsert.form.currency.error.required')),
      },
      schedules: {
        title: t('brand.locations.upsert.form.schedule.title'),
        subtitle: t('brand.locations.upsert.form.schedule.subtitle'),
        label: t('brand.locations.upsert.form.schedule.label'),
        defaultValue: [
          ...Array.from({ length: 5 }).map((_, index) => ({
            day: index + 1,
            start: 540,
            end: 1080,
          })),
          {
            day: 0,
            start: 0,
            end: 0,
          },
          {
            day: 6,
            start: 0,
            end: 0,
          },
        ],
        scheme: getWeekdayScheduleScheme(
          t('brand.locations.upsert.form.schedule.error.required'),
        ),
      },
      phone: {
        defaultValue: phoneDefaultValue,
        label: t('brand.locations.upsert.form.phone.label'),
        placeholder: t('brand.locations.upsert.form.phone.placeholder'),
        scheme: getPhoneInputSchema(
          t('brand.locations.upsert.form.phone.error.invalid'),
          true,
        ),
      },
      email: {
        label: t('brand.locations.upsert.form.email.label'),
        placeholder: t('brand.locations.upsert.form.email.placeholder'),
        scheme: yup
          .string()
          .nullable()
          .email(t('brand.locations.upsert.form.email.error.invalid_format'))
          .ensure(),
      },
      instagram: {
        label: t('brand.locations.upsert.form.instagram.label'),
        placeholder: t('brand.locations.upsert.form.instagram.placeholder'),
        scheme: getAppLinkSchema(
          t('brand.locations.upsert.form.instagram.error.validation'),
          true,
        ).nullable(),
      },
      remark: {
        label: t('brand.locations.upsert.form.remark.label'),
        placeholder: t('brand.locations.upsert.form.remark.placeholder'),
        scheme: yup.string().nullable().ensure(),
      },
      contactInfo: {
        title: t('brand.locations.upsert.form.contact_info.title'),
        subtitle: t('brand.locations.upsert.form.contact_info.subtitle'),
      },
      gallery: {
        maxImages: 10,
        label: t('brand.locations.upsert.form.gallery.label'),
      },
      advantages: {
        multiselect: true,
        title: t('brand.locations.upsert.form.advantages.title'),
        subtitle: t('brand.locations.upsert.form.advantages.subtitle'),
        defaultValue: [],
        scheme: yup.array().of(object()).required(),
      },
      address: {
        title: t('brand.locations.upsert.form.address.title'),
        subtitle: t('brand.locations.upsert.form.address.subtitle'),
        label: t('brand.locations.upsert.form.address.label'),
        placeholder: t('brand.locations.upsert.form.address.placeholder'),
        scheme: yup
          .string()
          .required(t('brand.locations.upsert.form.address.error.required')),
      },
      floor: {
        label: t('brand.locations.upsert.form.floor.label'),
        placeholder: t('brand.locations.upsert.form.floor.placeholder'),
        scheme: yup.string().nullable().ensure(),
      },
      entrance: {
        label: t('brand.locations.upsert.form.entrance.label'),
        placeholder: t('brand.locations.upsert.form.entrance.placeholder'),
        scheme: yup.string().nullable().ensure(),
      },
    }),
    [brand?.name, t],
  );
};
