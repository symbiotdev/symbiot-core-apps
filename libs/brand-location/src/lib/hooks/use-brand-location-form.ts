import { useMemo } from 'react';
import * as yup from 'yup';
import { object } from 'yup';
import { useTranslation } from 'react-i18next';
import { useCurrentBrandState } from '@symbiot-core-apps/state';
import states from 'states-us';
import { countryToCurrency } from '@symbiot-core-apps/shared';
import {
  getAppLinkSchema,
  getWeekdayScheduleScheme,
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
        title: t('brand_location.form.name.title'),
        subtitle: t('brand_location.form.name.subtitle'),
        label: t('brand_location.form.name.label'),
        placeholder: t('brand_location.form.name.placeholder', {
          brandName: brand?.name,
        }),
        scheme: yup
          .string()
          .required(t('brand_location.form.name.error.required')),
      },
      country: {
        defaultValue: getCountry(defaultCountryCode as CountryCode)
          ? defaultCountryCode
          : undefined,
        title: t('brand_location.form.country.title'),
        subtitle: t('brand_location.form.country.subtitle'),
        sheetLabel: t('shared.country'),
        label: t('brand_location.form.country.label'),
        placeholder: t('brand_location.form.country.placeholder'),
        scheme: yup
          .string()
          .required(t('brand_location.form.country.error.required')),
      },
      timezone: {
        defaultValue: 'UTC',
        title: t('brand_location.form.timezone.title'),
        subtitle: t('brand_location.form.timezone.subtitle'),
        sheetLabel: t('shared.timezone'),
        label: t('brand_location.form.timezone.label'),
        placeholder: t('brand_location.form.timezone.placeholder'),
        scheme: yup
          .string()
          .required(t('brand_location.form.timezone.error.required')),
      },
      usState: {
        defaultValue: defaultState,
        label: t('brand_location.form.us_state.label'),
        sheetLabel: t('brand_location.form.us_state.sheet_label'),
        placeholder: t('brand_location.form.us_state.placeholder'),
        scheme: yup
          .string()
          .required(t('brand_location.form.us_state.error.required')),
      },
      currency: {
        title: t('brand_location.form.currency.title'),
        subtitle: t('brand_location.form.currency.subtitle'),
        sheetLabel: t('shared.currency'),
        defaultValue: defaultCountryCode
          ? countryToCurrency[defaultCountryCode]
          : undefined,
        label: t('brand_location.form.currency.label'),
        placeholder: t('brand_location.form.currency.placeholder'),
        scheme: yup
          .string()
          .required(t('brand_location.form.currency.error.required')),
      },
      schedules: {
        title: t('brand_location.form.schedule.title'),
        subtitle: t('brand_location.form.schedule.subtitle'),
        label: t('brand_location.form.schedule.label'),
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
          t('brand_location.form.schedule.error.required'),
        ),
      },
      phone: {
        label: t('brand_location.form.phone.label'),
        placeholder: t('brand_location.form.phone.placeholder'),
        scheme: yup.string().nullable().nullable(),
      },
      email: {
        label: t('brand_location.form.email.label'),
        placeholder: t('brand_location.form.email.placeholder'),
        scheme: yup
          .string()
          .nullable()
          .email(t('brand_location.form.email.error.invalid_format'))
          .ensure(),
      },
      instagram: {
        label: t('brand_location.form.instagram.label'),
        placeholder: t('brand_location.form.instagram.placeholder'),
        scheme: getAppLinkSchema(
          t('brand_location.form.instagram.error.validation'),
          true,
        ).nullable(),
      },
      remark: {
        label: t('brand_location.form.remark.label'),
        placeholder: t('brand_location.form.remark.placeholder'),
        scheme: yup.string().nullable().ensure(),
      },
      contactInfo: {
        title: t('brand_location.form.contact_info.title'),
        subtitle: t('brand_location.form.contact_info.subtitle'),
      },
      gallery: {
        maxImages: 10,
        label: t('brand_location.form.gallery.label'),
      },
      advantages: {
        multiselect: true,
        title: t('brand_location.form.advantages.title'),
        subtitle: t('brand_location.form.advantages.subtitle'),
        defaultValue: [],
        scheme: yup.array().of(object()).required(),
      },
      address: {
        title: t('brand_location.form.address.title'),
        subtitle: t('brand_location.form.address.subtitle'),
        label: t('brand_location.form.address.label'),
        placeholder: t('brand_location.form.address.placeholder'),
        scheme: yup
          .string()
          .required(t('brand_location.form.address.error.required')),
      },
      floor: {
        label: t('brand_location.form.floor.label'),
        placeholder: t('brand_location.form.floor.placeholder'),
        scheme: yup.string().nullable().ensure(),
      },
      entrance: {
        label: t('brand_location.form.entrance.label'),
        placeholder: t('brand_location.form.entrance.placeholder'),
        scheme: yup.string().nullable().ensure(),
      },
    }),
    [brand?.name, t],
  );
};
