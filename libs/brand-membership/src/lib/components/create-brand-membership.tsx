import React, { useCallback, useEffect, useRef } from 'react';
import { useCurrentBrandState } from '@symbiot-core-apps/state';
import { useTranslation } from 'react-i18next';
import {
  BrandMembershipType,
  getTranslateKeyByBrandMembershipType,
  useCreateBrandPeriodBasedMembershipReq,
  useCreateBrandVisitBasedMembershipReq,
} from '@symbiot-core-apps/api';
import { router, useNavigation } from 'expo-router';
import { EventArg, NavigationAction } from '@react-navigation/native';
import { ConfirmAlert } from '@symbiot-core-apps/shared';
import { Survey, SurveyStep } from '@symbiot-core-apps/ui';
import { useForm } from 'react-hook-form';
import { BrandMembershipAvailabilityController } from './controller/brand-membership-availability-controller';
import { BrandMembershipNameController } from './controller/brand-membership-name-controller';
import { BrandMembershipDescriptionController } from './controller/brand-membership-description-controller';
import { BrandMembershipServicesController } from './controller/brand-membership-services-controller';
import { BrandMembershipCurrencyController } from './controller/brand-membership-currency-controller';
import { BrandMembershipPriceController } from './controller/brand-membership-price-controller';
import { BrandMembershipDiscountController } from './controller/brand-membership-discount-controller';
import { BrandMembershipNoteController } from './controller/brand-membership-note-controller';
import { BrandMembershipLocationController } from './controller/brand-membership-location-controller';
import { BrandMembershipVisitsController } from './controller/brand-membership-visits-controller';
import { BrandMembershipPeriodController } from './controller/brand-membership-period-controller';

export const CreateBrandMembership = ({
  type,
}: {
  type: BrandMembershipType;
}) => {
  const { brand } = useCurrentBrandState();
  const { t } = useTranslation();
  const {
    mutateAsync: createPeriodBasedMembership,
    isPending: isPeriodBasedMembershipLoading,
  } = useCreateBrandPeriodBasedMembershipReq();
  const {
    mutateAsync: createVisitBasedMembership,
    isPending: isVisitBasedMembershipLoading,
  } = useCreateBrandVisitBasedMembershipReq();
  const navigation = useNavigation();
  const tPrefix = getTranslateKeyByBrandMembershipType(type);

  const createdRef = useRef(false);

  const {
    control: aboutControl,
    getValues: aboutGetValues,
    formState: aboutFormState,
  } = useForm<{
    available: boolean;
    name: string;
    description: string;
  }>({
    defaultValues: {
      available: true,
      name: '',
      description: '',
    },
  });

  const {
    control: locationControl,
    getValues: locationGetValues,
    formState: locationFormState,
    watch: locationWatch,
  } = useForm<{
    location: string | null;
  }>({
    defaultValues: {
      location: null,
    },
  });

  const {
    control: servicesControl,
    getValues: servicesGetValues,
    formState: servicesFormState,
  } = useForm<{
    services: string[];
  }>({
    defaultValues: {
      services: [],
    },
  });

  const {
    control: pricingControl,
    getValues: pricingGetValues,
    formState: pricingFormState,
    watch: pricingWatch,
  } = useForm<{
    currency: string;
    price: number;
    discount: number;
    period: string;
    visits: number;
  }>({
    defaultValues: {
      currency: brand?.currencies?.[0]?.value,
      price: 0,
      discount: 0,
      period: '1-month',
      visits: 10,
    },
  });

  const {
    control: noteControl,
    getValues: noteGetValues,
    formState: noteFormState,
  } = useForm<{
    note: string;
  }>({
    defaultValues: {
      note: '',
    },
  });

  const onFinish = useCallback(async () => {
    const { name, description, available } = aboutGetValues();
    const { location } = locationGetValues();
    const { services } = servicesGetValues();
    const { price, discount, period, currency, visits } = pricingGetValues();
    const { note } = noteGetValues();

    const data = {
      hidden: !available,
      name,
      description,
      locations: location ? [location] : [],
      services,
      price,
      discount,
      currency,
      note,
    };

    const membership = await (type === BrandMembershipType.period
      ? createPeriodBasedMembership({
          ...data,
          period,
        })
      : createVisitBasedMembership({
          ...data,
          visits,
        }));

    createdRef.current = true;

    router.replace(`/memberships/${type}/${membership.id}/profile`);
  }, [
    aboutGetValues,
    locationGetValues,
    servicesGetValues,
    pricingGetValues,
    noteGetValues,
    type,
    createPeriodBasedMembership,
    createVisitBasedMembership,
  ]);

  const onLeave = useCallback(
    (e: EventArg<'beforeRemove', true, { action: NavigationAction }>) => {
      if (createdRef.current) return;

      e.preventDefault();

      ConfirmAlert({
        title: t(`${tPrefix}.create.discard.title`),
        message: t(`${tPrefix}.create.discard.message`),
        onAgree: () => navigation.dispatch(e.data.action),
      });
    },
    [t, navigation, tPrefix],
  );

  useEffect(() => {
    navigation.setOptions({
      gestureEnabled: false,
      headerShown:
        !isPeriodBasedMembershipLoading && !isVisitBasedMembershipLoading,
    });
  }, [
    isPeriodBasedMembershipLoading,
    isVisitBasedMembershipLoading,
    navigation,
  ]);

  useEffect(() => {
    navigation.addListener('beforeRemove', onLeave);

    return () => {
      navigation.removeListener('beforeRemove', onLeave);
    };
  }, [onLeave, navigation]);

  const { location } = locationWatch();
  const { currency, price, discount } = pricingWatch();

  const priceCurrency = currency
    ? brand?.currencies?.find(({ value }) => value === currency)
    : brand?.currencies?.[0];

  return (
    <Survey
      loading={
        isPeriodBasedMembershipLoading ||
        isVisitBasedMembershipLoading ||
        createdRef.current
      }
      onFinish={onFinish}
    >
      <SurveyStep
        canGoNext={aboutFormState.isValid}
        title={t(`${tPrefix}.create.steps.about.title`)}
        subtitle={t(`${tPrefix}.create.steps.about.subtitle`)}
      >
        <BrandMembershipAvailabilityController
          name="available"
          type={type}
          control={aboutControl}
        />
        <BrandMembershipNameController
          name="name"
          type={type}
          control={aboutControl}
        />
        <BrandMembershipDescriptionController
          name="description"
          type={type}
          control={aboutControl}
        />
      </SurveyStep>

      <SurveyStep
        canGoNext={locationFormState.isValid}
        title={t(`${tPrefix}.create.steps.location.title`)}
        subtitle={t(`${tPrefix}.create.steps.location.subtitle`)}
      >
        <BrandMembershipLocationController
          noLabel
          name="location"
          type={type}
          control={locationControl}
        />
      </SurveyStep>

      <SurveyStep
        skippable
        canGoNext={servicesFormState.isValid}
        title={t(`${tPrefix}.create.steps.services.title`)}
        subtitle={t(`${tPrefix}.create.steps.services.subtitle`)}
      >
        <BrandMembershipServicesController
          required
          noLabel
          name="services"
          type={type}
          location={location}
          control={servicesControl}
        />
      </SurveyStep>

      <SurveyStep
        canGoNext={pricingFormState.isValid && discount <= price}
        title={t(`${tPrefix}.create.steps.pricing.title`)}
        subtitle={t(`${tPrefix}.create.steps.pricing.subtitle`)}
      >
        {brand?.currencies && brand.currencies.length > 1 && (
          <BrandMembershipCurrencyController
            name="currency"
            type={type}
            control={pricingControl}
          />
        )}

        <BrandMembershipPriceController
          name="price"
          type={type}
          currency={priceCurrency}
          control={pricingControl}
        />
        <BrandMembershipDiscountController
          name="discount"
          type={type}
          currency={priceCurrency}
          control={pricingControl}
        />

        {type === BrandMembershipType.period && (
          <BrandMembershipPeriodController
            name="period"
            type={type}
            control={pricingControl}
          />
        )}

        {type === BrandMembershipType.visits && (
          <BrandMembershipVisitsController
            name="visits"
            type={type}
            control={pricingControl}
          />
        )}
      </SurveyStep>

      <SurveyStep
        skippable
        canGoNext={noteFormState.isValid}
        title={t(`${tPrefix}.create.steps.note.title`)}
        subtitle={t(`${tPrefix}.create.steps.note.subtitle`)}
      >
        <BrandMembershipNoteController
          noLabel
          required
          name="note"
          type={type}
          control={noteControl}
        />
      </SurveyStep>
    </Survey>
  );
};
