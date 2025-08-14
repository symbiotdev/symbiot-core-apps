import { Survey, SurveyStep } from '@symbiot-core-apps/survey';
import { useCallback, useMemo } from 'react';
import * as yup from 'yup';
import {
  getWeekdayScheduleScheme,
  WeekdaySchedule,
} from '@symbiot-core-apps/ui';
import { Icons } from '../../../../../../../icons/config';
import { useT } from '@symbiot-core-apps/i18n';
import { countries, TCountryCode } from 'countries-list';
import { countryToCurrency } from '@symbiot-core-apps/shared';

type Value = {
  schedule: WeekdaySchedule;
  country: string;
  currency: string;
};

const TypedSurvey = Survey<Value>;
const defaultCountryCode = Intl?.DateTimeFormat()
  ?.resolvedOptions()
  ?.locale?.split('-')?.[1];

export default () => {
  const { t } = useT();

  const steps: SurveyStep<Value>[] = useMemo(
    () => [
      {
        id: 'weekdays-schedule',
        nextId: 'name',
        title: t('brand.create.steps.schedule.title', { ns: 'app' }),
        subtitle: t('brand.create.steps.schedule.subtitle', { ns: 'app' }),
        elements: [
          {
            type: 'weekdays-schedule',
            props: {
              name: 'schedule',
              scheme: getWeekdayScheduleScheme(
                t('brand.create.steps.schedule.form.schedule.error.required', {
                  ns: 'app',
                }),
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
        id: 'country',
        nextId: 'currency',
        title: t('brand.create.steps.country.title', { ns: 'app' }),
        subtitle: t('brand.create.steps.country.subtitle', { ns: 'app' }),
        elements: [
          {
            type: 'country',
            props: {
              name: 'country',
              sheetLabel: t('country'),
              defaultValue: countries[defaultCountryCode as TCountryCode]
                ? defaultCountryCode
                : undefined,
              placeholder: t(
                'brand.create.steps.country.form.country.placeholder',
                {
                  ns: 'app',
                },
              ),
              scheme: yup.string().required(
                t('brand.create.steps.country.form.country.error.required', {
                  ns: 'app',
                }),
              ),
            },
          },
        ],
      },
      {
        id: 'currency',
        nextId: 'referral-source',
        title: t('brand.create.steps.currency.title', { ns: 'app' }),
        subtitle: t('brand.create.steps.currency.subtitle', { ns: 'app' }),
        elements: [
          {
            type: 'currency',
            props: {
              name: 'currency',
              sheetLabel: t('currency'),
              defaultValue: defaultCountryCode
                ? countryToCurrency[defaultCountryCode]
                : undefined,
              placeholder: t(
                'brand.create.steps.currency.form.currency.placeholder',
                {
                  ns: 'app',
                },
              ),
              scheme: yup.string().required(
                t('brand.create.steps.currency.form.currency.error.required', {
                  ns: 'app',
                }),
              ),
            },
          },
        ],
      },
    ],
    [t],
  );

  const onFinish = useCallback((value: Value) => {}, []);

  return (
    <TypedSurvey
      steps={steps}
      introIconName={Icons.Workspace}
      introTitle={t('brand.create.intro.title', {
        ns: 'app',
      })}
      introSubtitle={t('brand.create.intro.subtitle', {
        ns: 'app',
      })}
      introActionLabel={t('brand.create.intro.button.label', {
        ns: 'app',
      })}
      onFinish={onFinish}
    />
  );
};
