import { Survey, SurveyStep } from '@symbiot-core-apps/survey';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useCurrentBrandState, useGenders } from '@symbiot-core-apps/state';
import { PhoneValue } from '@symbiot-core-apps/ui';
import { ImagePickerAsset } from 'expo-image-picker';
import { useCreateBrandClientQuery } from '@symbiot-core-apps/api';
import { router } from 'expo-router';
import { useBrandClientForm } from '../hooks/use-brand-client-form';

type Value = {
  firstname: string;
  lastname: string;
  gender: string;
  birthday: string;
  phone: PhoneValue;
  email: string;
  address: string;
  avatar: ImagePickerAsset;
  note: string;
};

const TypedSurvey = Survey<Value>;

export const CreateBrandClient = () => {
  const { brand: currentBrand } = useCurrentBrandState();
  const form = useBrandClientForm();
  const {
    gendersAsOptionsWithEmptyOption,
    loading: gendersLoading,
    error: gendersError,
  } = useGenders();
  const { mutateAsync: createClient } = useCreateBrandClientQuery();

  const createdRef = useRef(false);

  const [processing, setProcessing] = useState(false);

  const steps: SurveyStep<Value>[] = useMemo(
    () => [
      {
        id: 'personality',
        nextId: 'contact-info',
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
              defaultValue: '',
            },
          },
          {
            type: 'input',
            props: {
              ...form.lastname,
              required: true,
              name: 'lastname',
              enterKeyHint: 'next',
              defaultValue: '',
            },
          },
          {
            type: 'select-picker',
            props: {
              ...form.gender,
              required: true,
              options: gendersAsOptionsWithEmptyOption,
              optionsLoading: gendersLoading,
              optionsError: gendersError,
              name: 'gender',
            },
          },
          {
            type: 'date-picker',
            props: {
              ...form.birthday,
              name: 'birthday',
            },
          },
        ],
      },
      {
        id: 'contact-info',
        nextId: 'avatar',
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
        id: 'avatar',
        nextId: 'notes',
        title: form.avatar.title,
        subtitle: form.avatar.subtitle,
        skippable: true,
        elements: [
          {
            type: 'avatar',
            props: {
              ...form.avatar,
              name: 'avatar',
              stepValueKey: 'firstname',
            },
          },
        ],
      },
      {
        id: 'notes',
        nextId: null,
        title: form.note.title,
        subtitle: form.note.subtitle,
        skippable: true,
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
    [form, gendersAsOptionsWithEmptyOption, gendersLoading, gendersError],
  );

  const onFinish = useCallback(
    async (value: Value) => {
      setProcessing(true);

      try {
        const client = await createClient({
          avatar: value.avatar,
          note: value.note,
          firstname: value.firstname,
          lastname: value.lastname,
          email: value.email,
          gender: value.gender,
          birthday: value.birthday,
          address: value.address,
          phones: value.phone ? [value.phone] : [],
        });

        createdRef.current = true;

        router.replace(`/clients/${client.id}/profile`);
      } finally {
        setProcessing(false);
      }
    },
    [createClient],
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
