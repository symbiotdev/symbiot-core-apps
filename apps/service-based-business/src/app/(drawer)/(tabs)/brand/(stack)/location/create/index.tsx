import { Survey, SurveyStep } from '@symbiot-core-apps/survey';
import { useCallback, useMemo, useRef, useState } from 'react';
import * as yup from 'yup';
import {
  getAppLinkSchema,
  getPhoneInputSchema,
  getWeekdayScheduleScheme,
  LinkItem,
  phoneDefaultValue,
  PhoneValue,
  WeekdaySchedule,
} from '@symbiot-core-apps/ui';
import { countries, TCountryCode } from 'countries-list';
import { countryToCurrency } from '@symbiot-core-apps/shared';
import { useCurrentBrandState } from '@symbiot-core-apps/state';
import { useTranslation } from 'react-i18next';
import states from 'states-us';
import { router } from 'expo-router';
import {
  BrandLocationQueryKey,
  queryClient,
  useCreateBrandLocationQuery,
} from '@symbiot-core-apps/api';

type Value = {
  name: string;
  schedules: WeekdaySchedule[];
  country: string;
  state: string;
  currency: string;
  phone: PhoneValue;
  email: string;
  instagram: LinkItem;
  remark: string;
};

const nameMaxLength = 256;
const remarkMaxLength = 512;
const TypedSurvey = Survey<Value>;
const defaultState = states[0].abbreviation;
const defaultCountryCode = Intl?.DateTimeFormat()
  ?.resolvedOptions()
  ?.locale?.split('-')?.[1];

export default () => {
  const { t } = useTranslation();
  const { brand } = useCurrentBrandState();
  const { mutateAsync: createLocation } = useCreateBrandLocationQuery();

  const createdRef = useRef(false);

  const [processing, setProcessing] = useState(false);

  const steps: SurveyStep<Value>[] = useMemo(
    () => [
      {
        id: 'name',
        nextId: 'country',
        title: t('brand.locations.create.steps.name.title'),
        subtitle: t('brand.locations.create.steps.name.subtitle'),
        elements: [
          {
            type: 'input',
            props: {
              name: 'name',
              enterKeyHint: 'done',
              maxLength: nameMaxLength,
              placeholder: t(
                'brand.locations.create.steps.name.form.name.placeholder',
                {
                  brandName: brand?.name,
                },
              ),
              scheme: yup
                .string()
                .max(
                  nameMaxLength,
                  t(
                    'brand.locations.create.steps.name.form.name.error.max_length',
                    {
                      max: nameMaxLength,
                    },
                  ),
                )
                .required(
                  t(
                    'brand.locations.create.steps.name.form.name.error.required',
                  ),
                ),
            },
          },
        ],
      },
      {
        id: 'country',
        nextId: 'currency',
        title: t('brand.locations.create.steps.country.title'),
        subtitle: t('brand.locations.create.steps.country.subtitle'),
        elements: [
          {
            type: 'country',
            props: {
              name: 'country',
              sheetLabel: t('shared.country'),
              defaultValue: countries[defaultCountryCode as TCountryCode]
                ? defaultCountryCode
                : undefined,
              placeholder: t(
                'brand.locations.create.steps.country.form.country.placeholder',
              ),
              scheme: yup
                .string()
                .required(
                  t(
                    'brand.locations.create.steps.country.form.country.error.required',
                  ),
                ),
            },
          },
          {
            type: 'us-state',
            props: {
              name: 'state',
              showWhen: (formValue) =>
                formValue.country?.toLowerCase() === 'us',
              defaultValue: defaultState,
              label: t(
                'brand.locations.create.steps.country.form.us_state.label',
              ),
              sheetLabel: t(
                'brand.locations.create.steps.country.form.us_state.sheet_label',
              ),
              placeholder: t(
                'brand.locations.create.steps.country.form.us_state.placeholder',
              ),
              scheme: yup
                .string()
                .required(
                  t(
                    'brand.locations.create.steps.country.form.us_state.error.required',
                  ),
                ),
            },
          },
        ],
      },
      {
        id: 'currency',
        nextId: 'weekdays-schedule',
        title: t('brand.locations.create.steps.currency.title'),
        subtitle: t('brand.locations.create.steps.currency.subtitle'),
        elements: [
          {
            type: 'currency',
            props: {
              name: 'currency',
              sheetLabel: t('shared.currency'),
              defaultValue: defaultCountryCode
                ? countryToCurrency[defaultCountryCode]
                : undefined,
              placeholder: t(
                'brand.locations.create.steps.currency.form.currency.placeholder',
              ),
              scheme: yup
                .string()
                .required(
                  t(
                    'brand.locations.create.steps.currency.form.currency.error.required',
                  ),
                ),
            },
          },
        ],
      },
      {
        id: 'weekdays-schedule',
        nextId: 'phone',
        title: t('brand.locations.create.steps.schedule.title'),
        subtitle: t('brand.locations.create.steps.schedule.subtitle'),
        elements: [
          {
            type: 'weekdays-schedule',
            props: {
              name: 'schedules',
              scheme: getWeekdayScheduleScheme(
                t(
                  'brand.locations.create.steps.schedule.form.schedule.error.required',
                ),
              ),
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
            },
          },
        ],
      },
      {
        id: 'phone',
        nextId: 'email',
        skippable: true,
        title: t('brand.locations.create.steps.phone.title'),
        subtitle: t('brand.locations.create.steps.phone.subtitle'),
        elements: [
          {
            type: 'phone',
            props: {
              name: 'phone',
              defaultValue: phoneDefaultValue,
              enterKeyHint: 'done',
              placeholder: t(
                'brand.locations.create.steps.phone.form.phone.placeholder',
              ),
              scheme: getPhoneInputSchema(
                t(
                  'brand.locations.create.steps.phone.form.phone.error.invalid',
                ),
              ),
            },
          },
        ],
      },
      {
        id: 'email',
        nextId: 'instagram',
        skippable: true,
        title: t('brand.locations.create.steps.email.title'),
        subtitle: t('brand.locations.create.steps.email.subtitle'),
        elements: [
          {
            type: 'email',
            props: {
              name: 'email',
              enterKeyHint: 'done',
              placeholder: t(
                'brand.locations.create.steps.email.form.email.placeholder',
              ),
              scheme: yup
                .string()
                .required(
                  t(
                    'brand.locations.create.steps.email.form.email.error.required',
                  ),
                )
                .email(
                  t(
                    'brand.locations.create.steps.email.form.email.error.invalid_format',
                  ),
                ),
            },
          },
        ],
      },
      {
        id: 'instagram',
        nextId: 'remark',
        title: t('brand.locations.create.steps.instagram.title'),
        subtitle: t('brand.locations.create.steps.instagram.subtitle'),
        skippable: true,
        elements: [
          {
            type: 'app-link',
            props: {
              type: 'instagram',
              name: 'instagram',
              maxLength: 256,
              keyboardType: 'url',
              enterKeyHint: 'done',
              placeholder: t(
                'brand.locations.create.steps.instagram.form.link.placeholder',
              ),
              scheme: getAppLinkSchema(
                t(
                  'brand.locations.create.steps.instagram.form.link.error.validation',
                ),
              ).required(
                t(
                  'brand.locations.create.steps.instagram.form.link.error.required',
                ),
              ),
            },
          },
        ],
      },
      {
        id: 'remark',
        nextId: null,
        title: t('brand.locations.create.steps.remark.title'),
        subtitle: t('brand.locations.create.steps.remark.subtitle'),
        skippable: true,
        elements: [
          {
            type: 'textarea',
            props: {
              name: 'remark',
              enterKeyHint: 'done',
              maxLength: remarkMaxLength,
              placeholder: t(
                'brand.locations.create.steps.remark.form.remark.placeholder',
              ),
              scheme: yup
                .string()
                .max(
                  remarkMaxLength,
                  t(
                    'brand.locations.create.steps.remark.form.remark.error.max_length',
                    {
                      max: remarkMaxLength,
                    },
                  ),
                )
                .required(
                  t(
                    'brand.locations.create.steps.remark.form.remark.error.required',
                  ),
                ),
            },
          },
        ],
      },
    ],
    [t, brand?.name],
  );

  const onFinish = useCallback(async (value: Value) => {
    setProcessing(true);

    try {
      await createLocation({
        name: value.name,
        country: value.country,
        usState: value.state,
        currency: value.currency,
        address: 'Address',
        lat: 1,
        lng: 2,
        email: value.email,
        remark: value.remark,
        links: value.instagram ? [value.instagram] : [],
        phones: value.phone ? [value.phone] : [],
        schedules: value.schedules,
      });
      await queryClient.refetchQueries({
        queryKey: [BrandLocationQueryKey.currentList],
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
      introTitle={t('brand.locations.create.intro.title')}
      introSubtitle={t('brand.locations.create.intro.subtitle')}
      introActionLabel={t('brand.locations.create.intro.button.label')}
      ignoreLeaveConfirmation={createdRef.current}
      onFinish={onFinish}
    />
  );
};
