import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import * as yup from 'yup';

export const useBrandClientForm = () => {
  const { t } = useTranslation();

  return useMemo(
    () => ({
      personalInfo: {
        title: t('brand.clients.upsert.form.personal_info.title'),
        subtitle: t('brand.clients.upsert.form.personal_info.subtitle'),
      },
      contactInfo: {
        title: t('brand.clients.upsert.form.contact_info.title'),
        subtitle: t('brand.clients.upsert.form.contact_info.subtitle'),
      },
      firstname: {
        label: t('brand.clients.upsert.form.firstname.label'),
        placeholder: t('brand.clients.upsert.form.firstname.placeholder'),
        scheme: yup
          .string()
          .required(t('brand.clients.upsert.form.firstname.error.required')),
      },
      lastname: {
        label: t('brand.clients.upsert.form.lastname.label'),
        placeholder: t('brand.clients.upsert.form.lastname.placeholder'),
        scheme: yup
          .string()
          .required(t('brand.clients.upsert.form.lastname.error.required')),
      },
      birthday: {
        label: t('brand.clients.upsert.form.birthday.label'),
        placeholder: t('brand.clients.upsert.form.birthday.placeholder'),
        scheme: yup.string().nullable().ensure(),
      },
      gender: {
        label: t('brand.clients.upsert.form.gender.label'),
        placeholder: t('brand.clients.upsert.form.gender.placeholder'),
        scheme: yup
          .string()
          .required(t('brand.clients.upsert.form.gender.error.required')),
      },
      phone: {
        label: t('brand.clients.upsert.form.phone.label'),
        placeholder: t('brand.clients.upsert.form.phone.placeholder'),
        scheme: yup.string().nullable().ensure(),
      },
      email: {
        label: t('brand.clients.upsert.form.email.label'),
        placeholder: t('brand.clients.upsert.form.email.placeholder'),
        scheme: yup
          .string()
          .nullable()
          .email(t('brand.clients.upsert.form.email.error.validation'))
          .ensure(),
      },
      address: {
        label: t('brand.clients.upsert.form.address.label'),
        placeholder: t('brand.clients.upsert.form.address.placeholder'),
        scheme: yup.string().nullable().ensure(),
      },
      avatar: {
        title: t('brand.clients.upsert.form.avatar.title'),
        subtitle: t('brand.clients.upsert.form.avatar.subtitle'),
        scheme: yup.object().required(),
      },
      note: {
        title: t('brand.clients.upsert.form.note.title'),
        subtitle: t('brand.clients.upsert.form.note.subtitle'),
        label: t('brand.clients.upsert.form.note.label'),
        placeholder: t('brand.clients.upsert.form.note.placeholder'),
        scheme: yup.string().nullable().ensure(),
        optionalScheme: yup.string().nullable().ensure(),
        maxLength: 1000,
      },
    }),
    [t],
  );
};
