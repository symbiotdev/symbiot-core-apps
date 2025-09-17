import {
  Account,
  BrandEmployeePermission,
  BrandEmployeePermissions,
  useBrandEmployeeGendersQuery,
  useBrandEmployeeNewAccountQuery,
  useBrandEmployeePermissionsQuery,
  useCreateBrandEmployeeQuery,
  useCurrentBrandLocationsQuery,
} from '@symbiot-core-apps/api';
import {
  LoadingView,
  PhoneValue,
  WeekdaySchedule,
} from '@symbiot-core-apps/ui';
import { ImagePickerAsset } from 'expo-image-picker';
import { Survey, SurveyStep } from '@symbiot-core-apps/survey';
import { useCurrentBrandState } from '@symbiot-core-apps/state';
import { useDynamicBrandLocation } from '@symbiot-core-apps/brand-location';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as yup from 'yup';
import { router, useLocalSearchParams } from 'expo-router';
import { useBrandEmployeeForm } from '../hooks/use-brand-employee-form';

type Value = {
  firstname: string;
  lastname: string;
  role: string;
  email: string;
  address: string;
  passport: string;
  taxId: string;
  about: string;
  location: string;
  permissions: BrandEmployeePermissions;
  birthday: string;
  phone: PhoneValue;
  customSchedule: boolean;
  provider: boolean;
  gender: string;
  schedule: WeekdaySchedule[];
  avatar: ImagePickerAsset;
};

const TypedSurvey = Survey<Value>;

export const CreateBrandEmployee = () => {
  const { brand: currentBrand } = useCurrentBrandState();
  const { data: permissions } = useBrandEmployeePermissionsQuery();
  const {
    data: locations,
    isPending: locationsLoading,
    error: locationsError,
  } = useCurrentBrandLocationsQuery();
  const {
    data: genders,
    isPending: gendersLoading,
    error: gendersError,
  } = useBrandEmployeeGendersQuery();
  const { mutateAsync: createEmployee } = useCreateBrandEmployeeQuery();
  const form = useBrandEmployeeForm();
  const dynamicLocation = useDynamicBrandLocation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { mutateAsync: getAccountById } = useBrandEmployeeNewAccountQuery();

  const createdRef = useRef(false);
  const [processing, setProcessing] = useState(false);

  const [account, setAccount] = useState<Account | undefined>(undefined);

  const locationsAsOptions = useMemo(
    () =>
      locations?.items && [
        dynamicLocation,
        ...locations.items.map((location) => ({
          label: location.name,
          description: location.address,
          value: location.id,
        })),
      ],
    [dynamicLocation, locations],
  );

  const steps: SurveyStep<Value>[] = useMemo(
    () => [
      {
        id: 'personality',
        nextId: 'avatar',
        title: form.personalInfo.title,
        subtitle: form.personalInfo.subtitle,
        elements: [
          {
            type: 'input',
            props: {
              ...form.firstname,
              required: true,
              name: 'firstname',
              enterKeyHint: 'next',
              defaultValue: account?.firstname,
            },
          },
          {
            type: 'input',
            props: {
              ...form.lastname,
              required: true,
              name: 'lastname',
              enterKeyHint: 'next',
              defaultValue: account?.lastname,
            },
          },
          {
            type: 'select-picker',
            props: {
              ...form.gender,
              required: true,
              options: genders,
              optionsLoading: gendersLoading,
              optionsError: gendersError,
              defaultValue: account?.gender?.value,
              name: 'gender',
            },
          },
          {
            type: 'date-picker',
            props: {
              ...form.birthday,
              name: 'birthday',
              defaultValue: account?.birthday,
            },
          },
          {
            type: 'input',
            props: {
              ...form.passport,
              name: 'passport',
              enterKeyHint: 'next',
            },
          },
          {
            type: 'input',
            props: {
              ...form.taxId,
              name: 'taxId',
              enterKeyHint: 'done',
            },
          },
        ],
      },
      {
        id: 'avatar',
        nextId: 'contact-info',
        title: form.avatar.title,
        subtitle: form.avatar.subtitle,
        skippable: true,
        elements: [
          {
            type: 'avatar',
            props: {
              ...form.avatar,
              name: 'avatar',
              defaultValue: account?.avatarXsUrl,
              stepValueKey: 'firstname',
            },
          },
        ],
      },
      {
        id: 'contact-info',
        nextId: 'location',
        title: form.contactInfo.title,
        subtitle: form.contactInfo.subtitle,
        elements: [
          {
            type: 'phone',
            props: {
              ...form.phone,
              required: true,
              name: 'phone',
              enterKeyHint: 'done',
              defaultValue: account?.phones?.[0] || form.phone.defaultValue,
            },
          },
          {
            type: 'email',
            props: {
              ...form.email,
              name: 'email',
              enterKeyHint: 'done',
            },
          },
          {
            type: 'input',
            props: {
              ...form.address,
              name: 'address',
              enterKeyHint: 'done',
            },
          },
        ],
      },
      {
        id: 'location',
        nextId: 'professionalActivity',
        title: form.location.title,
        subtitle: form.location.subtitle,
        elements: [
          {
            type: 'select-picker',
            props: {
              ...form.location,
              name: 'location',
              options: locationsAsOptions,
              optionsLoading: locationsLoading,
              optionsError: locationsError,
              defaultValue: null,
              label: '',
            },
          },
          {
            type: 'switch',
            props: {
              ...form.locationCustomSchedule,
              name: 'customSchedule',
              showWhen: (value) => !!value.location,
            },
          },
          {
            type: 'switch',
            props: {
              ...form.employeeSchedule,
              name: 'customSchedule',
              showWhen: (value) => !value.location,
            },
          },
          {
            type: 'weekdays-schedule',
            props: {
              ...form.schedules,
              name: 'schedule',
              label: form.schedules.subtitle,
              showWhen: (value) => value.customSchedule,
            },
          },
        ],
      },
      {
        id: 'professionalActivity',
        nextId: 'permissions',
        title: form.professionalActivity.title,
        subtitle: form.professionalActivity.subtitle,
        elements: [
          {
            type: 'input',
            props: {
              ...form.role,
              required: true,
              name: 'role',
              defaultValue: '',
            },
          },
          {
            type: 'switch',
            props: {
              ...form.provider,
              name: 'provider',
            },
          },
        ],
      },
      {
        id: 'permissions',
        nextId: 'about',
        title: form.permissions.title,
        subtitle: form.permissions.subtitle,
        elements: (permissions as BrandEmployeePermission[])?.map(
          (permission) => ({
            type: 'switch',
            props: {
              name: `permissions.${permission.key}`,
              label: permission.title,
              description: permission.subtitle,
              scheme: yup.boolean().nullable(),
            },
          }),
        ),
      },
      {
        id: 'about',
        nextId: null,
        title: form.about.title,
        subtitle: form.about.subtitle,
        skippable: true,
        elements: [
          {
            type: 'textarea',
            props: {
              ...form.about,
              label: '',
              name: 'about',
              enterKeyHint: 'done',
            },
          },
        ],
      },
    ],
    [
      form,
      account,
      permissions,
      genders,
      gendersLoading,
      gendersError,
      locationsAsOptions,
      locationsLoading,
      locationsError,
    ],
  );

  const onFinish = useCallback(
    async (value: Value) => {
      if (!account?.id) return;

      setProcessing(true);

      try {
        await createEmployee({
          id: account.id,
          data: {
            firstname: value.firstname,
            lastname: value.lastname,
            email: value.email,
            address: value.address,
            passport: value.passport,
            taxId: value.taxId,
            birthday: value.birthday ? String(value.birthday) : null,
            gender: value.gender,
            avatar: value.avatar,
            provider: value.provider,
            about: value.about,
            role: value.role,
            permissions: value.permissions,
            phones: value.phone ? [value.phone] : [],
            locations: value.location ? [value.location] : [],
            schedules:
              value.customSchedule || !value.location
                ? value.schedule.map((schedule) => ({
                    ...schedule,
                    location: value.location,
                  }))
                : [],
          },
        });

        createdRef.current = true;

        router.dismissTo('/employees');
      } finally {
        setProcessing(false);
      }
    },
    [account?.id, createEmployee],
  );

  useEffect(() => {
    getAccountById({ id }).then(setAccount).catch(router.back);
  }, [getAccountById, id]);

  return !account ? (
    <LoadingView />
  ) : (
    <TypedSurvey
      steps={steps}
      loading={processing}
      ignoreNavigation={createdRef.current || !currentBrand}
      onFinish={onFinish}
    />
  );
};
