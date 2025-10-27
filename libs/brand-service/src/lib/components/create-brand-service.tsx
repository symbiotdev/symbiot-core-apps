import { AvatarPicker, Survey, SurveyStep } from '@symbiot-core-apps/ui';
import {
  useBrandServiceFormatsReq,
  useCreateBrandServiceReq,
} from '@symbiot-core-apps/api';
import { router, useNavigation } from 'expo-router';
import { useTranslation } from 'react-i18next';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ImagePickerAsset } from 'expo-image-picker';
import { useForm } from 'react-hook-form';
import { BrandServiceAvailabilityController } from './controller/brand-service-availability-controller';
import { BrandServiceNameController } from './controller/brand-service-name-controller';
import { BrandServiceDescriptionController } from './controller/brand-service-description-controller';
import { useWindowDimensions } from 'react-native';
import { BrandServiceTypeController } from './controller/brand-service-type-controller';
import { BrandServiceFormatController } from './controller/brand-service-format-controller';
import { BrandServiceGenderController } from './controller/brand-service-gender-controller';
import { BrandServicePlacesController } from './controller/brand-service-places-controller';
import { BrandServiceLocationController } from './controller/brand-service-location-controller';
import { BrandServiceEmployeesController } from './controller/brand-service-employees-controller';
import { BrandServicePriceController } from './controller/brand-service-price-controller';
import { BrandServiceDiscountController } from './controller/brand-service-discount-controller';
import { useCurrentBrandState } from '@symbiot-core-apps/state';
import { BrandServiceCurrencyController } from './controller/brand-service-currency-controller';
import { BrandServiceNoteController } from './controller/brand-service-note-controller';
import { EventArg, NavigationAction } from '@react-navigation/native';
import { ConfirmAlert } from '@symbiot-core-apps/shared';
import { BrandServiceDurationController } from './controller/brand-service-duration-controller';
import { useApp } from '@symbiot-core-apps/app';

export const CreateBrandService = () => {
  const { brand } = useCurrentBrandState();
  const { t } = useTranslation();
  const { functionality } = useApp();
  const { height } = useWindowDimensions();
  const { mutateAsync, isPending } = useCreateBrandServiceReq();
  const navigation = useNavigation();
  const { data: formats } = useBrandServiceFormatsReq();

  const createdRef = useRef(false);

  const [avatar, setAvatar] = useState<ImagePickerAsset>();

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
    control: structureControl,
    getValues: structureGetValues,
    formState: structureFormState,
    watch: structureWatch,
  } = useForm<{
    type: string | null;
    format: string | null;
    places: number;
    duration: number;
    gender: string | null;
  }>({
    defaultValues: {
      type: null,
      format: null,
      gender: null,
      duration: 60,
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
    control: providersControl,
    getValues: providersGetValues,
    formState: providersFormState,
  } = useForm<{
    employees: string[];
  }>({
    defaultValues: {
      employees: [],
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
  }>({
    defaultValues: {
      currency: brand?.currencies?.[0]?.value,
      price: 0,
      discount: 0,
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
    const { type, format, places, gender, duration } = structureGetValues();
    const { location } = locationGetValues();
    const { employees } = providersGetValues();
    const { currency, price, discount } = pricingGetValues();
    const { note } = noteGetValues();

    const service = await mutateAsync({
      avatar,
      hidden: !available,
      name,
      description,
      type: type as string,
      format: format as string,
      places,
      gender,
      duration,
      locations: location ? [location] : [],
      employees,
      currency,
      price,
      discount,
      note,
    });

    createdRef.current = true;

    router.replace(`/services/${service.id}/profile`);
  }, [
    avatar,
    aboutGetValues,
    providersGetValues,
    locationGetValues,
    mutateAsync,
    noteGetValues,
    pricingGetValues,
    structureGetValues,
  ]);

  const onLeave = useCallback(
    (e: EventArg<'beforeRemove', true, { action: NavigationAction }>) => {
      if (createdRef.current) return;

      e.preventDefault();

      ConfirmAlert({
        title: t('brand_service.create.discard.title'),
        message: t('brand_service.create.discard.message'),
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

  const { name } = aboutWatch();
  const { format } = structureWatch();
  const { location } = locationWatch();
  const { currency, price, discount } = pricingWatch();

  const priceCurrency = currency
    ? brand?.currencies?.find(({ value }) => value === currency)
    : brand?.currencies?.[0];

  return (
    <Survey loading={isPending || createdRef.current} onFinish={onFinish}>
      <SurveyStep
        canGoNext={aboutFormState.isValid}
        title={t('brand_service.create.steps.about.title')}
        subtitle={t('brand_service.create.steps.about.subtitle')}
      >
        <BrandServiceAvailabilityController
          name="available"
          control={aboutControl}
        />
        <BrandServiceNameController name="name" control={aboutControl} />
        <BrandServiceDescriptionController
          name="description"
          control={aboutControl}
        />
      </SurveyStep>

      <SurveyStep
        skippable
        canGoNext={!!avatar}
        title={t('brand_service.create.steps.avatar.title')}
        subtitle={t('brand_service.create.steps.avatar.subtitle')}
      >
        <AvatarPicker
          removable={!!avatar}
          alignSelf="center"
          marginTop="$5"
          borderRadius="$10"
          url={avatar}
          name={name}
          color="$placeholderColor"
          size={{
            width: '100%',
            height: Math.max(height / 3, 250),
          }}
          onAttach={setAvatar}
          onRemove={() => setAvatar(undefined)}
        />
      </SurveyStep>

      <SurveyStep
        canGoNext={structureFormState.isValid}
        title={t('brand_service.create.steps.structure.title')}
        subtitle={t('brand_service.create.steps.structure.subtitle')}
      >
        <BrandServiceTypeController
          withEmpty
          required
          name="type"
          control={structureControl}
        />
        <BrandServiceFormatController
          withEmpty
          required
          name="format"
          control={structureControl}
        />
        {formats?.find(({ value }) => format === value)?.fixed === false && (
          <BrandServicePlacesController
            required
            name="places"
            control={structureControl}
          />
        )}
        <BrandServiceDurationController
          required
          name="duration"
          control={structureControl}
        />
        <BrandServiceGenderController
          required
          withEmpty
          name="gender"
          control={structureControl}
        />
      </SurveyStep>

      <SurveyStep
        canGoNext={locationFormState.isValid}
        title={t('brand_service.create.steps.location.title')}
        subtitle={t('brand_service.create.steps.location.subtitle')}
      >
        <BrandServiceLocationController
          noLabel
          name="location"
          control={locationControl}
        />
      </SurveyStep>

      <SurveyStep
        skippable
        canGoNext={providersFormState.isValid}
        title={t('brand_service.create.steps.providers.title')}
        subtitle={t('brand_service.create.steps.providers.subtitle')}
      >
        <BrandServiceEmployeesController
          required
          noLabel
          name="employees"
          location={location}
          control={providersControl}
        />
      </SurveyStep>

      {functionality.availability.servicePrice && (
        <SurveyStep
          canGoNext={pricingFormState.isValid && discount <= price}
          title={t('brand_service.create.steps.pricing.title')}
          subtitle={t('brand_service.create.steps.pricing.subtitle')}
        >
          {brand?.currencies && brand.currencies.length > 1 && (
            <BrandServiceCurrencyController
              name="currency"
              control={pricingControl}
            />
          )}

          <BrandServicePriceController
            name="price"
            currency={priceCurrency}
            control={pricingControl}
          />
          <BrandServiceDiscountController
            name="discount"
            currency={priceCurrency}
            control={pricingControl}
          />
        </SurveyStep>
      )}

      <SurveyStep
        skippable
        canGoNext={noteFormState.isValid}
        title={t('brand_service.create.steps.note.title')}
        subtitle={t('brand_service.create.steps.note.subtitle')}
      >
        <BrandServiceNoteController
          noLabel
          required
          name="note"
          control={noteControl}
        />
      </SurveyStep>
    </Survey>
  );
};
