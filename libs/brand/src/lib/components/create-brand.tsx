import { useTranslation } from 'react-i18next';
import { ImagePickerAsset } from 'expo-image-picker';
import { Survey, SurveyStep } from '@symbiot-core-apps/survey';
import {
  Link,
  useAppCompetitorsQuery,
  useAppReferralsQuery,
  useBrandCreateQuery,
  useBrandIndustriesQuery,
} from '@symbiot-core-apps/api';
import { useCallback, useMemo, useRef, useState } from 'react';
import { router } from 'expo-router';
import * as yup from 'yup';
import { getAppLinkSchema } from '@symbiot-core-apps/ui';
import { useAuthBrand, useBrandAuthState } from '../hooks/use-brand-auth';
import { useCurrentAccount } from '@symbiot-core-apps/state';

const codeMaxLength = 64;

type Value = {
  avatar?: ImagePickerAsset;
  competitorSourceId?: string;
  customCompetitorSource?: string;
  customReferralSource?: string;
  industry: string;
  name: string;
  promoCode?: string;
  referralSourceId?: string;
  website?: Omit<Link, 'id'>;
};

const TypedSurvey = Survey<Value>;
const isIndustriesEditable = Boolean(
  Number(process.env.EXPO_PUBLIC_INDUSTRIES_EDITABLE),
);

export const CreateBrand = () => {
  const { t } = useTranslation();
  const { me } = useCurrentAccount();
  const switchBrand = useAuthBrand();
  const { processing: authProcessing } = useBrandAuthState();
  const { data: referrals, isPending: referralsLoading } =
    useAppReferralsQuery();
  const { data: competitors, isPending: competitorsLoading } =
    useAppCompetitorsQuery();
  const {
    data: industries,
    isPending: industriesLoading,
    error: industriesError,
  } = useBrandIndustriesQuery();
  const { mutateAsync } = useBrandCreateQuery();

  const createdRef = useRef(false);

  const [processing, setProcessing] = useState(false);

  const additionalSteps: SurveyStep<Value>[] = useMemo(
    () =>
      !me?.sourced
        ? [
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
                    optionsLoading: referralsLoading,
                    options: referrals,
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
                            !referrals?.find(
                              (referral) =>
                                this.parent['referralSourceId'] ===
                                referral.value,
                            )?.free || !!value
                          );
                        },
                      ),
                    showWhen: ({ referralSourceId }) =>
                      !!referrals?.find(
                        (referral) => referralSourceId === referral.value,
                      )?.free,
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
                    optionsLoading: competitorsLoading,
                    options: competitors,
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
                            !competitors?.find(
                              (competitor) =>
                                this.parent['competitorSourceId'] ===
                                competitor.value,
                            )?.free || !!value
                          );
                        },
                      ),
                    showWhen: ({ competitorSourceId }) =>
                      !!competitors?.find(
                        (competitor) => competitorSourceId === competitor.value,
                      )?.free,
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
                        t(
                          'brand.create.steps.promo_code.form.code.error.required',
                        ),
                      ),
                  },
                },
              ],
            },
          ]
        : [],
    [
      competitors,
      competitorsLoading,
      me?.sourced,
      referrals,
      referralsLoading,
      t,
    ],
  );

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
                    name: 'industry',
                    scheme: yup.string().required(),
                    options: industries,
                    optionsLoading: industriesLoading,
                    optionsError: industriesError,
                  },
                },
              ],
            } as SurveyStep<Value>,
          ]
        : []),
      {
        id: 'website',
        nextId: additionalSteps[0]?.id,
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
      ...additionalSteps,
    ],
    [t, industries, industriesLoading, industriesError, additionalSteps],
  );

  const onFinish = useCallback(
    async (value: Value) => {
      setProcessing(true);

      try {
        const brand = await mutateAsync({
          name: value.name,
          avatar: value.avatar,
          promoCode: value.promoCode,
          industries: value.industry ? [value.industry] : [],
          links: value.website ? [value.website] : [],
          competitorSource: competitors?.find(
            (competitor) => value.competitorSourceId === competitor.value,
          )?.free
            ? value.customCompetitorSource
            : value.competitorSourceId,
          referralSource: referrals?.find(
            (referral) => value.referralSourceId === referral.value,
          )?.free
            ? value.customReferralSource
            : value.referralSourceId,
        });

        createdRef.current = true;

        router.replace('/');

        await switchBrand({ id: brand.id });
      } finally {
        setProcessing(false);
      }
    },
    [competitors, mutateAsync, referrals, switchBrand],
  );

  return (
    <TypedSurvey
      loading={processing}
      steps={steps}
      ignoreNavigation={createdRef.current || authProcessing}
      onFinish={onFinish}
    />
  );
};
