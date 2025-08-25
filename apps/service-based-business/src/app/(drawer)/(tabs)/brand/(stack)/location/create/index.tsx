import { Survey, SurveyStep } from '@symbiot-core-apps/survey';
import { useCallback, useMemo, useRef, useState } from 'react';
import { LinkItem, PhoneValue, WeekdaySchedule } from '@symbiot-core-apps/ui';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { useCreateBrandLocationQuery } from '@symbiot-core-apps/api';
import { useBrandLocationForm } from '@symbiot-core-apps/brand-location';

type Value = {
  name: string;
  schedules: WeekdaySchedule[];
  country: string;
  state: string;
  phone: PhoneValue;
  email: string;
  instagram: LinkItem;
  remark: string;
};

const TypedSurvey = Survey<Value>;

export default () => {
  const { t } = useTranslation();
  const { mutateAsync: createLocation } = useCreateBrandLocationQuery();
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
        nextId: 'weekdays-schedule',
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
        id: 'weekdays-schedule',
        nextId: 'phone',
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
        id: 'phone',
        nextId: 'email',
        skippable: true,
        title: form.phone.title,
        subtitle: form.phone.subtitle,
        elements: [
          {
            type: 'phone',
            props: {
              ...form.phone,
              name: 'phone',
              enterKeyHint: 'done',
              label: '',
            },
          },
        ],
      },
      {
        id: 'email',
        nextId: 'instagram',
        skippable: true,
        title: form.email.title,
        subtitle: form.email.subtitle,
        elements: [
          {
            type: 'email',
            props: {
              ...form.email,
              name: 'email',
              enterKeyHint: 'done',
              label: '',
            },
          },
        ],
      },
      {
        id: 'instagram',
        nextId: 'remark',
        title: form.instagram.title,
        subtitle: form.instagram.subtitle,
        skippable: true,
        elements: [
          {
            type: 'app-link',
            props: {
              ...form.instagram,
              label: '',
              type: 'instagram',
              name: 'instagram',
              enterKeyHint: 'done',
            },
          },
        ],
      },
      {
        id: 'remark',
        nextId: null,
        title: form.remark.title,
        subtitle: form.remark.subtitle,
        skippable: true,
        elements: [
          {
            type: 'textarea',
            props: {
              ...form.remark,
              label: '',
              name: 'remark',
              enterKeyHint: 'done',
            },
          },
        ],
      },
    ],
    [form],
  );

  const onFinish = useCallback(async (value: Value) => {
    setProcessing(true);

    try {
      await createLocation({
        name: value.name,
        country: value.country,
        usState: value.state,
        address: 'Address',
        lat: 1,
        lng: 2,
        email: value.email,
        remark: value.remark,
        links: value.instagram ? [value.instagram] : [],
        phones: value.phone ? [value.phone] : [],
        schedules: value.schedules,
      });

      createdRef.current = true;

      router.replace('/brand/menu/locations');
    } finally {
      setProcessing(false);
    }
  }, []);

  return (
    <TypedSurvey
      steps={steps}
      loading={processing}
      introIconName="MapPointWave"
      introTitle={t('brand.locations.upsert.intro.title')}
      introSubtitle={t('brand.locations.upsert.intro.subtitle')}
      introActionLabel={t('brand.locations.upsert.intro.button.label')}
      ignoreLeaveConfirmation={createdRef.current}
      onFinish={onFinish}
    />
  );
};
