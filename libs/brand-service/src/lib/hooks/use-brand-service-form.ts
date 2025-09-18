import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { DateHelper, minutesInDay } from '@symbiot-core-apps/shared';

export const useBrandServiceForm = () => {
  const { t } = useTranslation();

  return useMemo(
    () => ({
      about: {
        title: t('brand.services.upsert.form.about.title'),
        subtitle: t('brand.services.upsert.form.about.subtitle'),
      },
      structure: {
        title: t('brand.services.upsert.form.structure.title'),
        subtitle: t('brand.services.upsert.form.structure.subtitle'),
      },
      scheduling: {
        title: t('brand.services.upsert.form.scheduling.title'),
        subtitle: t('brand.services.upsert.form.scheduling.subtitle'),
      },
      pricing: {
        title: t('brand.services.upsert.form.pricing.title'),
        subtitle: t('brand.services.upsert.form.pricing.subtitle'),
      },
      name: {
        label: t('brand.services.upsert.form.name.label'),
        placeholder: t('brand.services.upsert.form.name.placeholder'),
        scheme: yup
          .string()
          .required(t('brand.services.upsert.form.name.error.required')),
      },
      avatar: {
        title: t('brand.services.upsert.form.avatar.title'),
        subtitle: t('brand.services.upsert.form.avatar.subtitle'),
        scheme: yup.object().required(),
      },
      description: {
        label: t('brand.services.upsert.form.description.label'),
        placeholder: t('brand.services.upsert.form.description.placeholder'),
        scheme: yup.string().nullable().ensure(),
      },
      type: {
        label: t('brand.services.upsert.form.type.label'),
        placeholder: t('brand.services.upsert.form.type.placeholder'),
        scheme: yup.string().required(),
      },
      format: {
        label: t('brand.services.upsert.form.format.label'),
        placeholder: t('brand.services.upsert.form.format.placeholder'),
        scheme: yup.string().required(),
      },
      places: {
        label: t('brand.services.upsert.form.places.label'),
        placeholder: t('brand.services.upsert.form.places.placeholder'),
        maxLength: 4,
        scheme: yup
          .number()
          .min(
            2,
            t('brand.services.upsert.form.places.error.min', {
              value: 2,
            }),
          )
          .max(
            9999,
            t('brand.services.upsert.form.places.error.max', {
              value: 9999,
            }),
          )
          .required(),
      },
      duration: {
        label: t('brand.services.upsert.form.duration.label'),
        placeholder: t('brand.services.upsert.form.duration.placeholder'),
        scheme: yup
          .number()
          .min(
            5,
            t('brand.services.upsert.form.duration.error.min', {
              value: `5 ${t('shared.datetime.unit.minutes')}`,
            }),
          )
          .max(
            7 * minutesInDay,
            t('brand.services.upsert.form.duration.error.max', {
              value: `${7 * minutesInDay} ${t('shared.datetime.unit.minutes')}`,
            }),
          ),
      },
      reminders: {
        label: t('brand.services.upsert.form.reminders.label'),
        placeholder: t('brand.services.upsert.form.reminders.placeholder'),
        scheme: yup.array(yup.number().required()).required(),
        options: [
          15,
          30,
          60,
          minutesInDay,
          minutesInDay * 3,
          minutesInDay * 7,
        ].map((minutes) => ({
          label: t('shared.datetime.time_before', {
            value: DateHelper.formatDuration(minutes),
          }),
          value: minutes,
        })),
      },
      providers: {
        title: t('brand.services.upsert.form.providers.title'),
        subtitle: t('brand.services.upsert.form.providers.subtitle'),
        scheme: yup.array(yup.string().required()).min(1).required(),
      },
      gender: {
        label: t('brand.services.upsert.form.gender.label'),
        placeholder: t('brand.services.upsert.form.gender.placeholder'),
        scheme: yup.string().nullable(),
      },
      price: {
        label: t('brand.services.upsert.form.price.label'),
        placeholder: t('brand.services.upsert.form.price.placeholder'),
        scheme: yup.number().required(),
      },
      discount: {
        label: t('brand.services.upsert.form.discount.label'),
        placeholder: t('brand.services.upsert.form.discount.placeholder'),
        scheme: yup.number().required(),
      },
      note: {
        title: t('brand.services.upsert.form.note.title'),
        subtitle: t('brand.services.upsert.form.note.subtitle'),
        label: t('brand.services.upsert.form.note.label'),
        placeholder: t('brand.services.upsert.form.note.placeholder'),
        scheme: yup.string().nullable().ensure(),
      },
      available: {
        label: t('brand.services.upsert.form.available.label'),
        scheme: yup.boolean().required(),
      },
    }),
    [t],
  );
};
