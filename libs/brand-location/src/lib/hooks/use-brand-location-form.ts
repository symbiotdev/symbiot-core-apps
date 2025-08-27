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

const remarkMaxLength = 512;
const nameMaxLength = 256;
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
        maxLength: nameMaxLength,
        title: t('brand.locations.upsert.form.name.title'),
        subtitle: t('brand.locations.upsert.form.name.subtitle'),
        label: t('brand.locations.upsert.form.name.label'),
        placeholder: t('brand.locations.upsert.form.name.placeholder', {
          brandName: brand?.name,
        }),
        scheme: yup
          .string()
          .max(
            nameMaxLength,
            t('brand.locations.upsert.form.name.error.max_length', {
              max: nameMaxLength,
            }),
          )
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
        title: t('brand.locations.upsert.form.phone.title'),
        subtitle: t('brand.locations.upsert.form.phone.subtitle'),
        label: t('brand.locations.upsert.form.phone.label'),
        placeholder: t('brand.locations.upsert.form.phone.placeholder'),
        scheme: getPhoneInputSchema(
          t('brand.locations.upsert.form.phone.error.invalid'),
        ),
        optionalScheme: getPhoneInputSchema(
          t('brand.locations.upsert.form.phone.error.invalid'),
          true,
        ),
      },
      email: {
        title: t('brand.locations.upsert.form.email.title'),
        subtitle: t('brand.locations.upsert.form.email.subtitle'),
        label: t('brand.locations.upsert.form.email.label'),
        placeholder: t('brand.locations.upsert.form.email.placeholder'),
        scheme: yup
          .string()
          .required(t('brand.locations.upsert.form.email.error.required'))
          .email(t('brand.locations.upsert.form.email.error.invalid_format')),
        optionalScheme: yup
          .string()
          .nullable()
          .email(t('brand.locations.upsert.form.email.error.invalid_format'))
          .ensure(),
      },
      instagram: {
        title: t('brand.locations.upsert.form.instagram.title'),
        subtitle: t('brand.locations.upsert.form.instagram.subtitle'),
        label: t('brand.locations.upsert.form.instagram.label'),
        placeholder: t('brand.locations.upsert.form.instagram.placeholder'),
        optionalScheme: getAppLinkSchema(
          t('brand.locations.upsert.form.instagram.error.validation'),
          true,
        ).nullable(),
        scheme: getAppLinkSchema(
          t('brand.locations.upsert.form.instagram.error.validation'),
        ).required(t('brand.locations.upsert.form.instagram.error.required')),
      },
      remark: {
        maxLength: remarkMaxLength,
        title: t('brand.locations.upsert.form.remark.title'),
        subtitle: t('brand.locations.upsert.form.remark.subtitle'),
        label: t('brand.locations.upsert.form.remark.label'),
        placeholder: t('brand.locations.upsert.form.remark.placeholder'),
        optionalScheme: yup
          .string()
          .max(
            remarkMaxLength,
            t('brand.locations.upsert.form.remark.error.max_length', {
              max: remarkMaxLength,
            }),
          )
          .nullable()
          .ensure(),
        scheme: yup
          .string()
          .max(
            remarkMaxLength,
            t('brand.locations.upsert.form.remark.error.max_length', {
              max: remarkMaxLength,
            }),
          )
          .required(t('brand.locations.upsert.form.remark.error.required')),
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
    }),
    [brand?.name, t],
  );
};
