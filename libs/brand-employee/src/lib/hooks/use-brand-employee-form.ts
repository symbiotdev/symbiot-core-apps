import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { getWeekdayScheduleScheme } from '@symbiot-core-apps/ui';

export const useBrandEmployeeForm = () => {
  const { t } = useTranslation();

  return useMemo(
    () => ({
      personalInfo: {
        title: t('brand_employee.form.personal_info.title'),
        subtitle: t('brand_employee.form.personal_info.subtitle'),
      },
      contactInfo: {
        title: t('brand_employee.form.contact_info.title'),
        subtitle: t('brand_employee.form.contact_info.subtitle'),
      },
      professionalActivity: {
        title: t('brand_employee.form.professional_activity.title'),
        subtitle: t(
          'brand_employee.form.professional_activity.subtitle',
        ),
      },
      identificationInfo: {
        title: t('brand_employee.form.identification_info.title'),
      },
      location: {
        title: t('brand_employee.form.location.title'),
        subtitle: t('brand_employee.form.location.subtitle'),
        label: t('brand_employee.form.location.label'),
        placeholder: t('brand_employee.form.location.placeholder'),
        scheme: yup.string().nullable().defined(),
      },
      avatar: {
        title: t('brand_employee.form.avatar.title'),
        subtitle: t('brand_employee.form.avatar.subtitle'),
        scheme: yup.object().required(),
      },
      firstname: {
        label: t('brand_employee.form.firstname.label'),
        placeholder: t('brand_employee.form.firstname.placeholder'),
        scheme: yup
          .string()
          .required(t('brand_employee.form.firstname.error.required')),
      },
      lastname: {
        label: t('brand_employee.form.lastname.label'),
        placeholder: t('brand_employee.form.lastname.placeholder'),
        scheme: yup
          .string()
          .required(t('brand_employee.form.lastname.error.required')),
      },
      birthday: {
        label: t('brand_employee.form.birthday.label'),
        placeholder: t('brand_employee.form.birthday.placeholder'),
        scheme: yup.string().nullable().ensure(),
      },
      gender: {
        label: t('brand_employee.form.gender.label'),
        placeholder: t('brand_employee.form.gender.placeholder'),
        scheme: yup
          .string()
          .required(t('brand_employee.form.gender.error.required')),
      },
      role: {
        label: t('brand_employee.form.role.label'),
        placeholder: t('brand_employee.form.role.placeholder'),
        scheme: yup
          .string()
          .required(t('brand_employee.form.role.error.required')),
      },
      provider: {
        label: t('brand_employee.form.provider.label'),
        description: t('brand_employee.form.provider.description'),
        scheme: yup.boolean().required(),
        defaultValue: true,
      },
      phone: {
        label: t('brand_employee.form.phone.label'),
        placeholder: t('brand_employee.form.phone.placeholder'),
        scheme: yup.string().nullable().ensure(),
      },
      locationCustomSchedule: {
        label: t('brand_employee.form.location_custom_schedule.label'),
        description: t(
          'brand_employee.form.location_custom_schedule.description',
        ),
        scheme: yup.boolean().defined(),
        defaultValue: false,
      },
      employeeSchedule: {
        label: t('brand_employee.form.employee_schedule.label'),
        description: t(
          'brand_employee.form.employee_schedule.description',
        ),
        scheme: yup.boolean().defined(),
        defaultValue: false,
      },
      permissions: {
        title: t('brand_employee.form.permissions.title'),
        subtitle: t('brand_employee.form.permissions.subtitle'),
      },
      schedules: {
        title: t('brand_employee.form.schedule.title'),
        subtitle: t('brand_employee.form.schedule.subtitle'),
        label: t('brand_employee.form.schedule.label'),
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
          t('brand_employee.form.schedule.error.required'),
        ),
      },
      email: {
        label: t('brand_employee.form.email.label'),
        placeholder: t('brand_employee.form.email.placeholder'),
        scheme: yup
          .string()
          .nullable()
          .email(t('brand_employee.form.email.error.validation'))
          .ensure(),
      },
      address: {
        label: t('brand_employee.form.address.label'),
        placeholder: t('brand_employee.form.address.placeholder'),
        scheme: yup.string().nullable().ensure(),
      },
      passport: {
        label: t('brand_employee.form.passport.label'),
        placeholder: t('brand_employee.form.passport.placeholder'),
        scheme: yup.string().nullable().ensure(),
      },
      taxId: {
        label: t('brand_employee.form.tax_id.label'),
        placeholder: t('brand_employee.form.tax_id.placeholder'),
        scheme: yup.string().nullable().ensure(),
      },
      about: {
        title: t('brand_employee.form.about.title'),
        subtitle: t('brand_employee.form.about.subtitle'),
        label: t('brand_employee.form.about.label'),
        placeholder: t('brand_employee.form.about.placeholder'),
        scheme: yup.string().nullable().ensure(),
      },
    }),
    [t],
  );
};
