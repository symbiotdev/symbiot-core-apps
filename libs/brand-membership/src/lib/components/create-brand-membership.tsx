import React, { useCallback, useEffect, useRef } from 'react';
import { useCurrentBrandState } from '@symbiot-core-apps/state';
import { useTranslation } from 'react-i18next';
import { useCreateBrandMembershipQuery } from '@symbiot-core-apps/api';
import { router, useNavigation } from 'expo-router';
import { EventArg, NavigationAction } from '@react-navigation/native';
import { ConfirmAlert } from '@symbiot-core-apps/shared';
import { Survey, SurveyStep } from '@symbiot-core-apps/ui';
import { useForm } from 'react-hook-form';
import { BrandMembershipAvailabilityController } from './controller/brand-membership-availability-controller';
import { BrandMembershipNameController } from './controller/brand-membership-name-controller';
import { BrandMembershipDescriptionController } from './controller/brand-membership-description-controller';
import { BrandServiceLocationController } from '../../../../brand-service/src/lib/components/controller/brand-service-location-controller';
import { BrandMembershipServicesController } from './controller/brand-membership-services-controller';
import { BrandMembershipCurrencyController } from './controller/brand-membership-currency-controller';
import { BrandMembershipPriceController } from './controller/brand-membership-price-controller';
import { BrandMembershipDiscountController } from './controller/brand-membership-discount-controller';
import { BrandMembershipValidityController } from './controller/brand-membership-validity-controller';
import { BrandMembershipNoteController } from './controller/brand-membership-note-controller';

export const CreateBrandMembership = () => {
  const { brand } = useCurrentBrandState();
  const { t } = useTranslation();
  const { mutateAsync, isPending } = useCreateBrandMembershipQuery();
  const navigation = useNavigation();

  const createdRef = useRef(false);

  const {
    control: aboutControl,
    getValues: aboutGetValues,
    formState: aboutFormState,
    watch: aboutWatch,
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
    validity: number | null;
  }>({
    defaultValues: {
      currency: brand?.currencies?.[0]?.value,
      price: 0,
      discount: 0,
      validity: 1,
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
    const { price, discount, validity, currency } = pricingGetValues();
    const { note } = noteGetValues();

    const membership = await mutateAsync({
      hidden: !available,
      name,
      description,
      location,
      services,
      price,
      discount,
      validity,
      currency,
      note,
    });

    createdRef.current = true;

    router.replace(`/memberships/${membership.id}/profile`);
  }, [
    aboutGetValues,
    locationGetValues,
    mutateAsync,
    noteGetValues,
    pricingGetValues,
    servicesGetValues,
  ]);

  const onLeave = useCallback(
    (e: EventArg<'beforeRemove', true, { action: NavigationAction }>) => {
      if (createdRef.current) return;

      e.preventDefault();

      ConfirmAlert({
        title: t('brand_membership.create.discard.title'),
        message: t('brand_membership.create.discard.message'),
        callback: () => navigation.dispatch(e.data.action),
      });
    },
    [t, navigation],
  );

  useEffect(() => {
    navigation.setOptions({
      gestureEnabled: false,
      headerShown: !isPending,
    });
  }, [isPending, navigation]);

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
    <Survey loading={isPending || createdRef.current} onFinish={onFinish}>
      <SurveyStep
        canGoNext={aboutFormState.isValid}
        title={t('brand_membership.create.steps.about.title')}
        subtitle={t('brand_membership.create.steps.about.subtitle')}
      >
        <BrandMembershipAvailabilityController
          name="available"
          control={aboutControl}
        />
        <BrandMembershipNameController name="name" control={aboutControl} />
        <BrandMembershipDescriptionController
          name="description"
          control={aboutControl}
        />
      </SurveyStep>

      <SurveyStep
        canGoNext={locationFormState.isValid}
        title={t('brand_membership.create.steps.location.title')}
        subtitle={t('brand_membership.create.steps.location.subtitle')}
      >
        <BrandServiceLocationController
          noLabel
          name="location"
          control={locationControl}
        />
      </SurveyStep>

      <SurveyStep
        skippable
        canGoNext={servicesFormState.isValid}
        title={t('brand_membership.create.steps.services.title')}
        subtitle={t('brand_membership.create.steps.services.subtitle')}
      >
        <BrandMembershipServicesController
          required
          noLabel
          name="services"
          location={location}
          control={servicesControl}
        />
      </SurveyStep>

      <SurveyStep
        canGoNext={pricingFormState.isValid && discount <= price}
        title={t('brand_membership.create.steps.pricing.title')}
        subtitle={t('brand_membership.create.steps.pricing.subtitle')}
      >
        {brand?.currencies && brand.currencies.length > 1 && (
          <BrandMembershipCurrencyController
            name="currency"
            control={pricingControl}
          />
        )}

        <BrandMembershipPriceController
          name="price"
          currency={priceCurrency}
          control={pricingControl}
        />
        <BrandMembershipDiscountController
          name="discount"
          currency={priceCurrency}
          control={pricingControl}
        />
        <BrandMembershipValidityController
          name="validity"
          control={pricingControl}
        />
      </SurveyStep>

      <SurveyStep
        skippable
        canGoNext={noteFormState.isValid}
        title={t('brand_membership.create.steps.note.title')}
        subtitle={t('brand_membership.create.steps.note.subtitle')}
      >
        <BrandMembershipNoteController
          noLabel
          required
          name="note"
          control={noteControl}
        />
      </SurveyStep>
    </Survey>
  );
};
