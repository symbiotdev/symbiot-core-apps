import React, { useCallback, useEffect, useRef } from 'react';
import { useCurrentBrandState } from '@symbiot-core-apps/state';
import { useTranslation } from 'react-i18next';
import { useCreateBrandTicketQuery } from '@symbiot-core-apps/api';
import { router, useNavigation } from 'expo-router';
import { EventArg, NavigationAction } from '@react-navigation/native';
import { ConfirmAlert } from '@symbiot-core-apps/shared';
import { Survey, SurveyStep } from '@symbiot-core-apps/ui';
import { useForm } from 'react-hook-form';
import { BrandTicketAvailabilityController } from './controller/brand-ticket-availability-controller';
import { BrandTicketNameController } from './controller/brand-ticket-name-controller';
import { BrandTicketDescriptionController } from './controller/brand-ticket-description-controller';
import { BrandTicketServicesController } from './controller/brand-ticket-services-controller';
import { BrandTicketCurrencyController } from './controller/brand-ticket-currency-controller';
import { BrandTicketPriceController } from './controller/brand-ticket-price-controller';
import { BrandTicketDiscountController } from './controller/brand-ticket-discount-controller';
import { BrandTicketNoteController } from './controller/brand-ticket-note-controller';
import { BrandTicketLocationController } from './controller/brand-ticket-location-controller';
import { BrandTicketVisitsController } from './controller/brand-ticket-visits-controller';

export const CreateBrandTicket = () => {
  const { brand } = useCurrentBrandState();
  const { t } = useTranslation();
  const { mutateAsync, isPending } = useCreateBrandTicketQuery();
  const navigation = useNavigation();

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
    visits: number;
  }>({
    defaultValues: {
      currency: brand?.currencies?.[0]?.value,
      price: 0,
      discount: 0,
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
    const { price, discount, visits, currency } = pricingGetValues();
    const { note } = noteGetValues();

    const ticket = await mutateAsync({
      hidden: !available,
      name,
      description,
      locations: location ? [location] : [],
      services,
      price,
      discount,
      visits,
      currency,
      note,
    });

    createdRef.current = true;

    router.replace(`/tickets/${ticket.id}/profile`);
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
        title: t('brand_ticket.create.discard.title'),
        message: t('brand_ticket.create.discard.message'),
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
        title={t('brand_ticket.create.steps.about.title')}
        subtitle={t('brand_ticket.create.steps.about.subtitle')}
      >
        <BrandTicketAvailabilityController
          name="available"
          control={aboutControl}
        />
        <BrandTicketNameController name="name" control={aboutControl} />
        <BrandTicketDescriptionController
          name="description"
          control={aboutControl}
        />
      </SurveyStep>

      <SurveyStep
        canGoNext={locationFormState.isValid}
        title={t('brand_ticket.create.steps.location.title')}
        subtitle={t('brand_ticket.create.steps.location.subtitle')}
      >
        <BrandTicketLocationController
          noLabel
          name="location"
          control={locationControl}
        />
      </SurveyStep>

      <SurveyStep
        skippable
        canGoNext={servicesFormState.isValid}
        title={t('brand_ticket.create.steps.services.title')}
        subtitle={t('brand_ticket.create.steps.services.subtitle')}
      >
        <BrandTicketServicesController
          required
          noLabel
          name="services"
          location={location}
          control={servicesControl}
        />
      </SurveyStep>

      <SurveyStep
        canGoNext={pricingFormState.isValid && discount <= price}
        title={t('brand_ticket.create.steps.pricing.title')}
        subtitle={t('brand_ticket.create.steps.pricing.subtitle')}
      >
        {brand?.currencies && brand.currencies.length > 1 && (
          <BrandTicketCurrencyController
            name="currency"
            control={pricingControl}
          />
        )}

        <BrandTicketPriceController
          name="price"
          currency={priceCurrency}
          control={pricingControl}
        />
        <BrandTicketDiscountController
          name="discount"
          currency={priceCurrency}
          control={pricingControl}
        />
        <BrandTicketVisitsController name="visits" control={pricingControl} />
      </SurveyStep>

      <SurveyStep
        skippable
        canGoNext={noteFormState.isValid}
        title={t('brand_ticket.create.steps.note.title')}
        subtitle={t('brand_ticket.create.steps.note.subtitle')}
      >
        <BrandTicketNoteController
          noLabel
          required
          name="note"
          control={noteControl}
        />
      </SurveyStep>
    </Survey>
  );
};
