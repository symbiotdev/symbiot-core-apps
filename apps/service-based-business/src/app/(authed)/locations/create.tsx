import { Survey, SurveyStep } from '@symbiot-core-apps/survey';
import { useCallback, useMemo, useRef, useState } from 'react';
import { LinkItem, PhoneValue, WeekdaySchedule } from '@symbiot-core-apps/ui';
import { router } from 'expo-router';
import {
  BrandLocationAdvantage,
  useCreateBrandLocationQuery,
} from '@symbiot-core-apps/api';
import {
  useBrandLocationAdvantageOptions,
  useBrandLocationForm,
} from '@symbiot-core-apps/brand-location';
import { useCurrentBrandState } from '@symbiot-core-apps/state';

type Value = {
  name: string;
  schedules: WeekdaySchedule[];
  country: string;
  state: string;
  phone: PhoneValue;
  email: string;
  instagram: LinkItem;
  remark: string;
  floor: string;
  entrance: string;
  address: string;
  advantages: BrandLocationAdvantage[];
};

const TypedSurvey = Survey<Value>;

export default () => {
  const { brand: currentBrand } = useCurrentBrandState();
  const { mutateAsync: createLocation } = useCreateBrandLocationQuery();
  const { advantages, advantagesLoading, advantagesError } =
    useBrandLocationAdvantageOptions();
  const form = useBrandLocationForm();

  const createdRef = useRef(false);

  const [processing, setProcessing] = useState(false);

  const steps: SurveyStep<Value>[] = useMemo(
    () => [
      {
        id: 'name',
        nextId: 'country',
        title: form.name.title,
        subtitle: form.name.subtitle,
        elements: [
          {
            type: 'input',
            props: {
              ...form.name,
              label: '',
              name: 'name',
              enterKeyHint: 'done',
            },
          },
        ],
      },
      {
        id: 'country',
        nextId: 'address',
        title: form.country.title,
        subtitle: form.country.subtitle,
        elements: [
          {
            type: 'country',
            props: {
              ...form.country,
              name: 'country',
              label: '',
            },
          },
          {
            type: 'us-state',
            props: {
              name: 'state',
              showWhen: (formValue) =>
                formValue.country?.toLowerCase() === 'us',
              ...form.usState,
            },
          },
        ],
      },
      {
        id: 'address',
        nextId: 'weekdays-schedule',
        title: form.address.title,
        subtitle: form.address.subtitle,
        elements: [
          {
            type: 'address',
            props: {
              ...form.address,
              name: 'address',
              label: '',
            },
          },
          {
            type: 'input',
            props: {
              ...form.entrance,
              name: 'entrance',
            },
          },
          {
            type: 'input',
            props: {
              ...form.floor,
              name: 'floor',
              regex: /\d+/,
              keyboardType: 'numeric',
            },
          },
          {
            type: 'textarea',
            props: {
              ...form.remark,
              scheme: form.remark.scheme,
              name: 'remark',
              enterKeyHint: 'done',
            },
          },
        ],
      },
      {
        id: 'weekdays-schedule',
        nextId: 'advantages',
        title: form.schedules.title,
        subtitle: form.schedules.subtitle,
        elements: [
          {
            type: 'weekdays-schedule',
            props: {
              ...form.schedules,
              name: 'schedules',
              label: '',
            },
          },
        ],
      },
      {
        id: 'advantages',
        nextId: 'contact-info',
        title: form.advantages.title,
        subtitle: form.address.subtitle,
        elements: [
          {
            type: 'toggle-group',
            props: {
              ...form.advantages,
              label: '',
              name: 'advantages',
              optionsLoading: advantagesLoading,
              optionsError: advantagesError,
              options: advantages,
            },
          },
        ],
      },
      {
        id: 'contact-info',
        nextId: null,
        title: form.contactInfo.title,
        subtitle: form.contactInfo.subtitle,
        elements: [
          {
            type: 'phone',
            props: {
              ...form.phone,
              name: 'phone',
              enterKeyHint: 'next',
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
            type: 'app-link',
            props: {
              ...form.instagram,
              type: 'instagram',
              name: 'instagram',
              enterKeyHint: 'done',
            },
          },
        ],
      },
    ],
    [form, advantages, advantagesLoading, advantagesError],
  );

  const onFinish = useCallback(
    async (value: Value) => {
      setProcessing(true);

      try {
        await createLocation({
          name: value.name,
          address: value.address,
          floor: value.floor,
          entrance: value.entrance,
          country: value.country,
          usState: value.state,
          email: value.email,
          remark: value.remark,
          links: value.instagram ? [value.instagram] : [],
          phones: value.phone ? [value.phone] : [],
          schedules: value.schedules,
          advantages: value.advantages?.map(({ id }) => id),
        });

        createdRef.current = true;

        router.dismissAll();
        router.push('/locations');
      } finally {
        setProcessing(false);
      }
    },
    [createLocation],
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
