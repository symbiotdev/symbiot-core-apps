import { Survey, SurveyStep } from '@symbiot-core-apps/survey';
import { useCallback, useMemo, useRef, useState } from 'react';
import * as yup from 'yup';
import {
  Button,
  EmptyView,
  getAppLinkSchema,
  PageView,
} from '@symbiot-core-apps/ui';
import {
  Link,
  useAppCompetitorSource,
  useAppReferralSource,
  useBrandCreateQuery,
  useBrandIndustryQuery,
} from '@symbiot-core-apps/api';
import { ImagePickerAsset } from 'expo-image-picker';
import { useAuthBrand } from '@symbiot-core-apps/brand';
import { router } from 'expo-router';
import { useApp } from '@symbiot-core-apps/app';
import { useTranslation } from 'react-i18next';

const codeMaxLength = 64;

type Value = {
  name: string;
  industryId: string;
  avatar?: ImagePickerAsset;
  referralSourceId?: string;
  customReferralSource?: string;
  competitorSourceId?: string;
  customCompetitorSource?: string;
  promoCode?: string;
  website?: Omit<Link, 'id'>;
};

const TypedSurvey = Survey<Value>;
const isIndustriesEditable = Boolean(
  Number(process.env.EXPO_PUBLIC_INDUSTRIES_EDITABLE),
);

export default () => {
  const { t } = useTranslation();
  const switchBrand = useAuthBrand();
  const { data: referralSources, isPending: referralSourcesLoading } =
    useAppReferralSource();
  const { data: competitorSources, isPending: competitorSourcesLoading } =
    useAppCompetitorSource();
  const { data: brandIndustries, isPending: brandIndustriesLoading } =
    useBrandIndustryQuery();
  const { mutateAsync } = useBrandCreateQuery();

  const createdRef = useRef(false);

  const [started, setStarted] = useState(false);
  const [processing, setProcessing] = useState(false);

  const steps: SurveyStep<Value>[] = useMemo(
    () => [
      {
        id: 'name',
        nextId: 'avatar',
        title: t('brand.create.steps.name.title'),
        subtitle: t('brand.create.steps.name.subtitle'),
        elements: [
          {
            type: 'input',
            props: {
              name: 'name',
              placeholder: t('brand.create.steps.name.form.name.placeholder'),
              enterKeyHint: 'done',
              scheme: yup
                .string()
                .required(
                  t('brand.create.steps.name.form.name.error.required'),
                ),
            },
          },
        ],
      },
      {
        id: 'avatar',
        nextId: isIndustriesEditable ? 'industry' : 'website',
        title: t('brand.create.steps.avatar.title'),
        subtitle: t('brand.create.steps.avatar.subtitle'),
        skippable: true,
        elements: [
          {
            type: 'avatar',
            props: {
              name: 'avatar',
              stepValueKey: 'name',
              scheme: yup.object().required(),
            },
          },
        ],
      },
      ...(isIndustriesEditable
        ? [
            {
              id: 'industry',
              nextId: 'website',
              title: t('brand.create.steps.industry.title'),
              subtitle: t('brand.create.steps.industry.subtitle'),
              elements: [
                {
                  type: 'toggle-group',
                  props: {
                    label: '',
                    name: 'industryId',
                    scheme: yup.string().required(),
                    optionsLoading: brandIndustriesLoading,
                    options: brandIndustries
                      ?.sort((a, b) => b.rate - a.rate)
                      ?.map((industry) => ({
                        label: industry.name,
                        value: industry.id,
                      })),
                  },
                },
              ],
            } as SurveyStep<Value>,
          ]
        : []),
      {
        id: 'website',
        nextId: 'referral-source',
        title: t('brand.create.steps.website.title'),
        subtitle: t('brand.create.steps.website.subtitle'),
        skippable: true,
        elements: [
          {
            type: 'app-link',
            props: {
              type: 'website',
              name: 'website',
              keyboardType: 'url',
              enterKeyHint: 'done',
              placeholder: t(
                'brand.create.steps.website.form.link.placeholder',
              ),
              scheme: getAppLinkSchema(
                t('brand.create.steps.website.form.link.error.validation'),
              ).required(
                t('brand.create.steps.website.form.link.error.required'),
              ),
            },
          },
        ],
      },
      {
        id: 'referral-source',
        nextId: 'competitor-source',
        title: t('brand.create.steps.referral_source.title'),
        subtitle: t('brand.create.steps.referral_source.subtitle'),
        skippable: true,
        elements: [
          {
            type: 'toggle-group',
            props: {
              label: '',
              name: 'referralSourceId',
              scheme: yup.string().required(),
              optionsLoading: referralSourcesLoading,
              options: referralSources
                ?.sort((a, b) => b.rate - a.rate)
                ?.map((source) => ({
                  label: source.name,
                  value: source.id,
                })),
            },
          },
          {
            type: 'input',
            props: {
              name: 'customReferralSource',
              placeholder: t(
                'brand.create.steps.referral_source.form.external_source.placeholder',
              ),
              enterKeyHint: 'done',
              scheme: yup
                .string()
                .test(
                  'validate-extended',
                  t(
                    'brand.create.steps.referral_source.form.external_source.error.required',
                  ),
                  function (value) {
                    return (
                      !referralSources?.find(
                        ({ id }) => this.parent['referralSourceId'] === id,
                      )?.customizable || !!value
                    );
                  },
                ),
              showWhen: ({ referralSourceId }) =>
                !!referralSources?.find(({ id }) => referralSourceId === id)
                  ?.customizable,
            },
          },
        ],
      },
      {
        id: 'competitor-source',
        nextId: 'promo-code',
        title: t('brand.create.steps.competitor_source.title'),
        subtitle: t('brand.create.steps.competitor_source.subtitle'),
        skippable: true,
        elements: [
          {
            type: 'toggle-group',
            props: {
              label: '',
              name: 'competitorSourceId',
              scheme: yup.string().required(),
              optionsLoading: competitorSourcesLoading,
              options: competitorSources
                ?.sort((a, b) => b.rate - a.rate)
                ?.map((source) => ({
                  label: source.name,
                  value: source.id,
                })),
            },
          },
          {
            type: 'input',
            props: {
              name: 'customCompetitorSource',
              placeholder: t(
                'brand.create.steps.competitor_source.form.external_source.placeholder',
              ),
              enterKeyHint: 'done',
              scheme: yup
                .string()
                .test(
                  'validate-extended',
                  t(
                    'brand.create.steps.competitor_source.form.external_source.error.required',
                  ),
                  function (value) {
                    return (
                      !competitorSources?.find(
                        ({ id }) => this.parent['competitorSourceId'] === id,
                      )?.customizable || !!value
                    );
                  },
                ),
              showWhen: ({ competitorSourceId }) =>
                !!competitorSources?.find(({ id }) => competitorSourceId === id)
                  ?.customizable,
            },
          },
        ],
      },
      {
        id: 'promo-code',
        nextId: null,
        title: t('brand.create.steps.promo_code.title'),
        subtitle: t('brand.create.steps.promo_code.subtitle'),
        skippable: true,
        elements: [
          {
            type: 'input',
            props: {
              name: 'promoCode',
              placeholder: t(
                'brand.create.steps.promo_code.form.code.placeholder',
              ),
              enterKeyHint: 'done',
              maxLength: codeMaxLength,
              scheme: yup
                .string()
                .required(
                  t('brand.create.steps.promo_code.form.code.error.required'),
                ),
            },
          },
        ],
      },
    ],
    [
      t,
      referralSources,
      referralSourcesLoading,
      competitorSources,
      competitorSourcesLoading,
      brandIndustries,
      brandIndustriesLoading,
    ],
  );

  const onFinish = useCallback(
    async (value: Value) => {
      setProcessing(true);

      try {
        const brand = await mutateAsync({
          name: value.name,
          avatar: value.avatar,
          promoCode: value.promoCode,
          industries: value.industryId ? [value.industryId] : [],
          referralSourceId: value.referralSourceId,
          customReferralSource: value.customReferralSource,
          competitorSourceId: value.competitorSourceId,
          customCompetitorSource: value.customCompetitorSource,
          links: value.website ? [value.website] : [],
        });

        createdRef.current = true;

        router.replace('/');

        await switchBrand({ id: brand.id });
      } finally {
        setProcessing(false);
      }
    },
    [mutateAsync, switchBrand],
  );

  if (!started) {
    return <Intro onStart={() => setStarted(true)} />;
  }

  return (
    <TypedSurvey
      loading={processing}
      steps={steps}
      ignoreLeaveConfirmation={createdRef.current}
      onFinish={onFinish}
    />
  );
};

const Intro = ({ onStart }: { onStart: () => void }) => {
  const { icons } = useApp();
  const { t } = useTranslation();

  return (
    <PageView
      scrollable
      animation="medium"
      opacity={1}
      enterStyle={{ opacity: 0 }}
      exitStyle={{ opacity: 0 }}
    >
      <EmptyView
        padding={0}
        iconName={icons.Workspace}
        title={t('brand.create.intro.title')}
        message={t('brand.create.intro.subtitle')}
      >
        <Button
          label={t('brand.create.intro.button.label')}
          onPress={onStart}
        />
      </EmptyView>
    </PageView>
  );
};
