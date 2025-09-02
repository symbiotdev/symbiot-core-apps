import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import {
  getPhoneInputSchema,
  getWeekdayScheduleScheme,
  phoneDefaultValue,
} from '@symbiot-core-apps/ui';

export const useBrandEmployeeForm = () => {
  const { t } = useTranslation();

  return useMemo(
    () => ({
      personalInfo: {
        title: t('brand.employees.upsert.form.personal_info.title'),
        subtitle: t('brand.employees.upsert.form.personal_info.subtitle'),
      },
      contactInfo: {
        title: t('brand.employees.upsert.form.contact_info.title'),
        subtitle: t('brand.employees.upsert.form.contact_info.subtitle'),
      },
      positionInfo: {
        title: t('brand.employees.upsert.form.position_info.title'),
        subtitle: t('brand.employees.upsert.form.position_info.subtitle'),
      },
      location: {
        title: t('brand.employees.upsert.form.location.title'),
        subtitle: t('brand.employees.upsert.form.location.subtitle'),
        label: t('brand.employees.upsert.form.location.label'),
        placeholder: t('brand.employees.upsert.form.location.placeholder'),
        scheme: yup.string().nullable(),
      },
      serviceType: {
        label: t('brand.employees.upsert.form.service_type.label'),
        scheme: yup.array().of(yup.object().required()).required(),
        multiselect: true,
      },
      avatar: {
        title: t('brand.employees.upsert.form.avatar.title'),
        subtitle: t('brand.employees.upsert.form.avatar.subtitle'),
        scheme: yup.object().required(),
      },
      firstname: {
        label: t('brand.employees.upsert.form.firstname.label'),
        placeholder: t('brand.employees.upsert.form.firstname.placeholder'),
        scheme: yup
          .string()
          .required(t('brand.employees.upsert.form.firstname.error.required')),
      },
      lastname: {
        label: t('brand.employees.upsert.form.lastname.label'),
        placeholder: t('brand.employees.upsert.form.lastname.placeholder'),
        scheme: yup
          .string()
          .required(t('brand.employees.upsert.form.lastname.error.required')),
      },
      birthday: {
        label: t('brand.employees.upsert.form.birthday.label'),
        placeholder: t('brand.employees.upsert.form.birthday.placeholder'),
        scheme: yup.string().nullable().ensure(),
      },
      gender: {
        label: t('brand.employees.upsert.form.gender.label'),
        placeholder: t('brand.employees.upsert.form.gender.placeholder'),
        scheme: yup
          .string()
          .required(t('brand.employees.upsert.form.gender.error.required')),
      },
      position: {
        label: t('brand.employees.upsert.form.position.label'),
        placeholder: t('brand.employees.upsert.form.position.placeholder'),
        scheme: yup
          .string()
          .required(t('brand.employees.upsert.form.position.error.required')),
      },
      provider: {
        label: t('brand.employees.upsert.form.provider.label'),
        scheme: yup.boolean().required(),
        defaultValue: true,
      },
      phone: {
        defaultValue: phoneDefaultValue,
        label: t('brand.employees.upsert.form.phone.label'),
        placeholder: t('brand.employees.upsert.form.phone.placeholder'),
        scheme: getPhoneInputSchema(
          t('brand.employees.upsert.form.phone.error.invalid'),
        ),
      },
      customSchedule: {
        label: t('brand.employees.upsert.form.custom_schedule.label'),
        scheme: yup.boolean().required(),
        defaultValue: false,
      },
      permissions: {
        title: t('brand.employees.upsert.form.permissions.title'),
        subtitle: t('brand.employees.upsert.form.permissions.subtitle'),
      },
      schedule: {
        title: t('brand.employees.upsert.form.schedule.title'),
        subtitle: t('brand.employees.upsert.form.schedule.subtitle'),
        label: t('brand.employees.upsert.form.schedule.label'),
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
          t('brand.employees.upsert.form.schedule.error.required'),
        ),
      },
      email: {
        label: t('brand.employees.upsert.form.email.label'),
        placeholder: t('brand.employees.upsert.form.email.placeholder'),
        scheme: yup
          .string()
          .nullable()
          .email(t('brand.employees.upsert.form.email.error.invalid_format'))
          .ensure(),
      },
      address: {
        label: t('brand.employees.upsert.form.address.label'),
        placeholder: t('brand.employees.upsert.form.address.placeholder'),
        scheme: yup.string().nullable().ensure(),
      },
      passport: {
        label: t('brand.employees.upsert.form.passport.label'),
        placeholder: t('brand.employees.upsert.form.passport.placeholder'),
        scheme: yup.string().nullable().ensure(),
      },
      taxId: {
        label: t('brand.employees.upsert.form.tax_id.label'),
        placeholder: t('brand.employees.upsert.form.tax_id.placeholder'),
        scheme: yup.string().nullable().ensure(),
      },
      about: {
        title: t('brand.employees.upsert.form.about.title'),
        subtitle: t('brand.employees.upsert.form.about.subtitle'),
        label: t('brand.employees.upsert.form.about.label'),
        placeholder: t('brand.employees.upsert.form.about.placeholder'),
        scheme: yup
          .string()
          .required(t('brand.employees.upsert.form.about.error.required')),
        optionalScheme: yup.string().nullable().ensure(),
      },
    }),
    [t],
  );
};
