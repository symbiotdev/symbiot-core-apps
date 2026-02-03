import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Survey, SurveyStep } from '@symbiot-core-apps/ui';
import { useForm } from 'react-hook-form';
import { BrandNameController } from './contoller/brand-name-controller';
import { EventArg, NavigationAction } from '@react-navigation/native';
import { ConfirmAlert, useI18n } from '@symbiot-core-apps/shared';
import { router, useNavigation } from 'expo-router';
import { useAuthBrand, useBrandAuthState } from '../hooks/use-brand-auth';
import { useBrandCreateReq } from '@symbiot-core-apps/api';
import { useAppSettings } from '@symbiot-core-apps/app';
import { BrandWebsiteController } from './contoller/brand-website-controller';
import { useCurrentAccountState } from '@symbiot-core-apps/state';
import { BrandReferralSourceController } from './contoller/brand-referral-source-controller';
import { BrandCompetitorController } from './contoller/brand-competitor-controller';
import { ImagePickerAsset } from 'expo-image-picker';
import { CountryCode, getCountry } from 'countries-and-timezones';
import { BrandIndustryController } from './contoller/brand-industry-controller';
import { BrandCountryController } from './contoller/brand-country-controller';
import { AvatarPicker } from '@symbiot-core-apps/form-controller';
import { BrandPromoCodeController } from './contoller/brand-promo-code-controller';
import { useAccountSubscription } from '@symbiot-core-apps/account-subscription';

const defaultCountryCode = Intl?.DateTimeFormat()
  ?.resolvedOptions()
  ?.locale?.split('-')?.[1];

export const CreateBrand = () => {
  const { t } = useI18n();
  const { me } = useCurrentAccountState();
  const { functionality } = useAppSettings();
  const { mutateAsync, isPending } = useBrandCreateReq();
  const { hasActualSubscription } = useAccountSubscription();
  const { processing: authProcessing } = useBrandAuthState();
  const switchBrand = useAuthBrand();
  const navigation = useNavigation();
  const createdRef = useRef(false);
  const ignoreNavigation = createdRef.current || authProcessing;

  const [avatar, setAvatar] = useState<ImagePickerAsset>();
  const [isPromoCodeValid, setIsPromoCodeValid] = useState(false);

  const {
    control: nameControl,
    getValues: nameGetValues,
    formState: nameFormState,
    watch: nameWatch,
  } = useForm<{ name: string }>({
    defaultValues: { name: '' },
  });

  const {
    control: countryControl,
    getValues: countryGetValues,
    formState: countryFormState,
  } = useForm<{ country: string | null }>({
    defaultValues: {
      country: getCountry(defaultCountryCode as CountryCode)
        ? defaultCountryCode
        : null,
    },
  });

  const {
    control: industryControl,
    getValues: industryGetValues,
    formState: industryFormState,
  } = useForm<{ industry: string | null }>();

  const {
    control: websiteControl,
    getValues: websiteGetValues,
    formState: websiteFormState,
  } = useForm<{ website: string | null }>();

  const {
    control: referralSourceControl,
    getValues: referralSourceGetValues,
    formState: referralSourceFormState,
  } = useForm<{ referralSource: string | null }>();

  const {
    control: competitorSourceControl,
    getValues: competitorSourceGetValues,
    formState: competitorSourceFormState,
  } = useForm<{ competitorSource: string | null }>();

  const {
    control: promoCodeControl,
    getValues: promoCodeGetValues,
    formState: promoCodeFormState,
  } = useForm<{ promoCode: string | null }>({
    defaultValues: { promoCode: '' },
  });

  const onFinish = useCallback(async () => {
    const { name } = nameGetValues();
    const { country } = countryGetValues();
    const { website } = websiteGetValues();
    const { industry } = industryGetValues();
    const { promoCode } = promoCodeGetValues();
    const { referralSource } = referralSourceGetValues();
    const { competitorSource } = competitorSourceGetValues();

    const brand = await mutateAsync({
      name,
      avatar,
      competitorSource,
      referralSource,
      websites: website ? [website] : [],
      countries: country ? [country] : [],
      industries: industry ? [industry] : [],
      promoCode: isPromoCodeValid ? promoCode : undefined,
    });

    createdRef.current = true;

    router.replace('/');

    await switchBrand({ id: brand.id });
  }, [
    avatar,
    isPromoCodeValid,
    competitorSourceGetValues,
    countryGetValues,
    industryGetValues,
    mutateAsync,
    nameGetValues,
    promoCodeGetValues,
    referralSourceGetValues,
    switchBrand,
    websiteGetValues,
  ]);

  const onLeave = useCallback(
    (e: EventArg<'beforeRemove', true, { action: NavigationAction }>) => {
      if (ignoreNavigation) return;

      e.preventDefault();

      ConfirmAlert({
        title: t('brand.create.discard.title'),
        message: t('brand.create.discard.message'),
        onAgree: () => navigation.dispatch(e.data.action),
      });
    },
    [ignoreNavigation, t, navigation],
  );

  useEffect(() => {
    navigation.setOptions({
      gestureEnabled: false,
      headerShown: !isPending && !ignoreNavigation,
    });
  }, [ignoreNavigation, isPending, navigation]);

  useEffect(() => {
    navigation.addListener('beforeRemove', onLeave);

    return () => {
      navigation.removeListener('beforeRemove', onLeave);
    };
  }, [onLeave, navigation]);

  return (
    <Survey loading={isPending || createdRef.current} onFinish={onFinish}>
      <SurveyStep
        canGoNext={nameFormState.isValid}
        title={t('brand.create.steps.name.title')}
        subtitle={t('brand.create.steps.name.subtitle')}
      >
        <BrandNameController noLabel name="name" control={nameControl} />
      </SurveyStep>

      <SurveyStep
        canGoNext={countryFormState.isValid}
        title={t('brand.create.steps.country.title')}
        subtitle={t('brand.create.steps.country.subtitle')}
      >
        <BrandCountryController
          noLabel
          name="country"
          control={countryControl}
        />
      </SurveyStep>

      <SurveyStep
        skippable
        canGoNext={!!avatar}
        title={t('brand.create.steps.avatar.title')}
        subtitle={t('brand.create.steps.avatar.subtitle')}
      >
        <AvatarPicker
          allowsEditing
          removable={!!avatar}
          alignSelf="center"
          marginTop="$5"
          url={avatar}
          name={nameWatch().name}
          color="$placeholderColor"
          size={140}
          onAttach={setAvatar}
          onRemove={() => setAvatar(undefined)}
        />
      </SurveyStep>

      {functionality.availability.brandIndustry && (
        <SurveyStep
          canGoNext={industryFormState.isValid}
          title={t('brand.create.steps.industry.title')}
          subtitle={t('brand.create.steps.industry.subtitle')}
        >
          <BrandIndustryController
            noLabel
            name="industry"
            control={industryControl}
          />
        </SurveyStep>
      )}

      <SurveyStep
        skippable
        canGoNext={websiteFormState.isValid}
        title={t('brand.create.steps.website.title')}
        subtitle={t('brand.create.steps.website.subtitle')}
      >
        <BrandWebsiteController
          noLabel
          name="website"
          required
          control={websiteControl}
        />
      </SurveyStep>

      {!me?.sourced && (
        <SurveyStep
          skippable
          canGoNext={referralSourceFormState.isValid}
          title={t('brand.create.steps.referral_source.title')}
          subtitle={t('brand.create.steps.referral_source.subtitle')}
        >
          <BrandReferralSourceController
            noLabel
            name="referralSource"
            control={referralSourceControl}
          />
        </SurveyStep>
      )}

      {functionality.availability.brandCompetitor && !me?.sourced && (
        <SurveyStep
          skippable
          canGoNext={competitorSourceFormState.isValid}
          title={t('brand.create.steps.competitor_source.title')}
          subtitle={t('brand.create.steps.competitor_source.subtitle')}
        >
          <BrandCompetitorController
            noLabel
            name="competitorSource"
            control={competitorSourceControl}
          />
        </SurveyStep>
      )}

      {functionality.canUseReferralProgram &&
        !hasActualSubscription &&
        !me?.privileged && (
          <SurveyStep
            skippable
            canGoNext={isPromoCodeValid}
            title={t('brand.create.steps.promo_code.title')}
            subtitle={t('brand.create.steps.promo_code.subtitle')}
          >
            <BrandPromoCodeController
              noLabel
              name="promoCode"
              control={promoCodeControl}
              onCheckValidity={setIsPromoCodeValid}
            />
          </SurveyStep>
        )}
    </Survey>
  );
};
