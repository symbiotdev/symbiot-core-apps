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
      professionalActivity: {
        title: t('brand.employees.upsert.form.professional_activity.title'),
        subtitle: t('brand.employees.upsert.form.professional_activity.subtitle'),
      },
      identificationInfo: {
        title: t('brand.employees.upsert.form.identification_info.title'),
      },
      location: {
        title: t('brand.employees.upsert.form.location.title'),
        subtitle: t('brand.employees.upsert.form.location.subtitle'),
        label: t('brand.employees.upsert.form.location.label'),
        placeholder: t('brand.employees.upsert.form.location.placeholder'),
        scheme: yup.string().nullable().defined(),
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
      role: {
        label: t('brand.employees.upsert.form.role.label'),
        placeholder: t('brand.employees.upsert.form.role.placeholder'),
        scheme: yup
          .string()
          .required(t('brand.employees.upsert.form.role.error.required')),
      },
      provider: {
        label: t('brand.employees.upsert.form.provider.label'),
        description: t('brand.employees.upsert.form.provider.description'),
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
      locationCustomSchedule: {
        label: t('brand.employees.upsert.form.location_custom_schedule.label'),
        description: t(
          'brand.employees.upsert.form.location_custom_schedule.description',
        ),
        scheme: yup.boolean().defined(),
        defaultValue: false,
      },
      employeeSchedule: {
        label: t('brand.employees.upsert.form.employee_schedule.label'),
        description: t(
          'brand.employees.upsert.form.employee_schedule.description',
        ),
        scheme: yup.boolean().defined(),
        defaultValue: false,
      },
      permissions: {
        title: t('brand.employees.upsert.form.permissions.title'),
        subtitle: t('brand.employees.upsert.form.permissions.subtitle'),
      },
      schedules: {
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
        scheme: yup.string().nullable().ensure(),
      },
    }),
    [t],
  );
};
