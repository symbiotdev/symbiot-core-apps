import { Survey, SurveyStep } from '@symbiot-core-apps/survey';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useCurrentBrandState } from '@symbiot-core-apps/state';
import { useBrandServiceForm } from '../hooks/use-brand-service-form';
import {
  CreateBrandService as TCreateBrandService,
  useBrandServiceFormatsQuery,
  useBrandServiceGendersQuery,
  useBrandServiceTypesQuery,
  useCreateBrandServiceQuery,
  useCurrentBrandEmployeeProvidersListQuery,
} from '@symbiot-core-apps/api';
import { Avatar } from '@symbiot-core-apps/ui';
import { router } from 'expo-router';
import { useWindowDimensions } from 'react-native';

type Value = Omit<TCreateBrandService, 'hidden'> & {
  available: boolean;
};

const TypedSurvey = Survey<Value>;

export const CreateBrandService = () => {
  const { brand: currentBrand } = useCurrentBrandState();
  const form = useBrandServiceForm();
  const { height } = useWindowDimensions();
  const { mutateAsync: createService } = useCreateBrandServiceQuery();
  const {
    data: types,
    isPending: typesLoading,
    error: typesError,
  } = useBrandServiceTypesQuery();
  const {
    data: formats,
    isPending: formatsLoading,
    error: formatsError,
  } = useBrandServiceFormatsQuery();
  const {
    data: genders,
    isPending: gendersLoading,
    error: gendersError,
  } = useBrandServiceGendersQuery();
  const {
    items: employees,
    isPending: employeesLoading,
    error: employeesError,
  } = useCurrentBrandEmployeeProvidersListQuery({
    params: {
      take: 999,
    },
  });

  const createdRef = useRef(false);
  const [processing, setProcessing] = useState(false);

  const steps: SurveyStep<Value>[] = useMemo(
    () => [
      {
        id: 'about',
        nextId: 'avatar',
        title: form.about.title,
        subtitle: form.about.subtitle,
        elements: [
          {
            type: 'switch',
            props: {
              ...form.available,
              name: 'available',
              defaultValue: true,
            },
          },
          {
            type: 'input',
            props: {
              ...form.name,
              required: true,
              name: 'name',
              enterKeyHint: 'next',
            },
          },
          {
            type: 'textarea',
            props: {
              ...form.description,
              name: 'description',
              enterKeyHint: 'done',
            },
          },
        ],
      },
      {
        id: 'avatar',
        nextId: 'structure',
        title: form.avatar.title,
        subtitle: form.avatar.subtitle,
        skippable: true,
        elements: [
          {
            type: 'avatar',
            props: {
              ...form.avatar,
              borderRadius: '$10',
              size: {
                width: '100%',
                height: Math.max(height / 3, 250),
              },
              name: 'avatar',
              stepValueKey: 'name',
              allowsEditing: false,
            },
          },
        ],
      },
      {
        id: 'structure',
        nextId: 'scheduling',
        title: form.structure.title,
        subtitle: form.structure.subtitle,
        elements: [
          {
            type: 'select-picker',
            props: {
              ...form.type,
              required: true,
              options: types && [
                {
                  label: '-',
                  value: null,
                },
                ...types,
              ],
              optionsLoading: typesLoading,
              optionsError: typesError,
              defaultValue: null,
              name: 'type',
            },
          },
          {
            type: 'select-picker',
            props: {
              ...form.format,
              required: true,
              showSelectedDescription: true,
              options: formats && [
                {
                  label: '-',
                  value: null,
                },
                ...formats,
              ],
              optionsLoading: formatsLoading,
              optionsError: formatsError,
              defaultValue: null,
              name: 'format',
            },
          },
          {
            type: 'input',
            props: {
              ...form.places,
              showWhen: (formValue) =>
                formats?.find(({ value }) => formValue.format === value)
                  ?.fixed === false,
              defaultValue: '2',
              name: 'places',
              type: 'numeric',
              required: true,
              regex: /\d+/,
              keyboardType: 'numeric',
            },
          },
          {
            type: 'select-picker',
            props: {
              ...form.gender,
              options: genders,
              optionsLoading: gendersLoading,
              optionsError: gendersError,
              defaultValue: null,
              name: 'gender',
            },
          },
        ],
      },
      {
        id: 'scheduling',
        nextId: 'team',
        title: form.scheduling.title,
        subtitle: form.scheduling.subtitle,
        elements: [
          {
            type: 'duration-picker',
            props: {
              ...form.duration,
              required: true,
              units: ['hours', 'minutes'],
              defaultValue: 60,
              name: 'duration',
            },
          },
          {
            type: 'toggle-group',
            props: {
              ...form.reminders,
              defaultValue: [],
              multiselect: true,
              name: 'reminders',
            },
          },
        ],
      },
      {
        id: 'team',
        nextId: 'pricing',
        skippable: true,
        title: form.providers.title,
        subtitle: form.providers.subtitle,
        elements: [
          {
            type: 'toggle-group',
            props: {
              ...form.providers,
              name: 'employees',
              multiselect: true,
              allowEmpty: true,
              defaultValue: [],
              optionsLoading: employeesLoading,
              optionsError: employeesError,
              options: employees?.map((employee) => ({
                label: employee.name,
                description: employee.role,
                value: employee.id,
                icon: (
                  <Avatar
                    name={employee.name}
                    size={40}
                    url={employee.avatarXsUrl}
                    color={employee.avatarColor}
                  />
                ),
              })),
            },
          },
        ],
      },
      {
        id: 'pricing',
        nextId: 'note',
        skippable: true,
        title: form.pricing.title,
        subtitle: form.pricing.subtitle,
        elements: [
          {
            type: 'price-input',
            props: {
              ...form.price,
              defaultValue: 0,
              name: 'price',
            },
          },
          {
            type: 'price-input',
            props: {
              ...form.discount,
              defaultValue: 0,
              name: 'discount',
            },
          },
        ],
      },
      {
        id: 'note',
        nextId: null,
        skippable: true,
        title: form.note.title,
        subtitle: form.note.subtitle,
        elements: [
          {
            type: 'textarea',
            props: {
              ...form.note,
              label: '',
              name: 'note',
              enterKeyHint: 'done',
            },
          },
        ],
      },
    ],
    [
      height,
      form,
      types,
      typesLoading,
      typesError,
      formats,
      formatsLoading,
      formatsError,
      employees,
      employeesLoading,
      employeesError,
      genders,
      gendersLoading,
      gendersError,
    ],
  );

  const onFinish = useCallback(
    async (value: Value) => {
      try {
        setProcessing(true);

        const service = await createService({
          ...value,
          hidden: !value.available,
        });

        createdRef.current = true;

        router.replace(`/services/${service.id}/profile`);
      } finally {
        setProcessing(false);
      }
    },
    [createService],
  );

  return (
    <TypedSurvey
      steps={steps}
      loading={processing}
      ignoreNavigation={createdRef.current || !currentBrand}
      onFinish={onFinish}
    />
  );
};
