import { Survey, SurveyStep, WeekdaySchedule } from '@symbiot-core-apps/ui';
import { useCreateBrandLocationQuery } from '@symbiot-core-apps/api';
import React, { useCallback, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { BrandLocationNameController } from './controller/brand-location-name-controller';
import { BrandLocationCountryController } from './controller/brand-location-country-controller';
import { useCurrentBrandState } from '@symbiot-core-apps/state';
import { BrandLocationUsStateController } from './controller/brand-location-us-state-controller';
import { BrandLocationAddressController } from './controller/brand-location-address-controller';
import { BrandLocationEntranceController } from './controller/brand-location-entrance-controller';
import { BrandLocationFloorController } from './controller/brand-location-floor-controller';
import { BrandLocationRemarkController } from './controller/brand-location-remark-controller';
import { BrandLocationAdvantagesController } from './controller/brand-location-advantages-controller';
import { BrandLocationScheduleController } from './controller/brand-location-schedule-controller';
import { BrandLocationInstagramController } from './controller/brand-location-instagram-controller';
import { BrandLocationEmailController } from './controller/brand-location-email-controller';
import { BrandLocationPhoneController } from './controller/brand-location-phone-controller';
import { BrandLocationCurrencyController } from './controller/brand-location-currency-controller';
import { router, useNavigation } from 'expo-router';
import { EventArg, NavigationAction } from '@react-navigation/native';
import { ConfirmAlert } from '@symbiot-core-apps/shared';

export const CreateBrandLocation = () => {
  const { brand } = useCurrentBrandState();
  const { t } = useTranslation();
  const { mutateAsync, isPending } = useCreateBrandLocationQuery();
  const navigation = useNavigation();

  const createdRef = useRef(false);

  const {
    control: nameControl,
    getValues: nameGetValues,
    formState: nameFormState,
  } = useForm<{ name: string }>({
    defaultValues: { name: '' },
  });

  const {
    control: countryControl,
    getValues: countryGetValues,
    formState: countryFormState,
    watch: countryWatch,
  } = useForm<{ country: string; usState: string | null }>({
    defaultValues: { country: brand?.countries?.[0]?.value, usState: null },
  });

  const {
    control: currencyControl,
    getValues: currencyGetValues,
    formState: currencyFormState,
  } = useForm<{ currency: string }>({
    defaultValues: { currency: brand?.currencies?.[0]?.value },
  });

  const { country } = countryWatch();

  const {
    control: addressControl,
    getValues: addressGetValues,
    formState: addressFormState,
  } = useForm<{
    address: string;
    entrance: string;
    floor: string;
    remark: string;
  }>({
    defaultValues: { address: '', entrance: '', floor: '', remark: '' },
  });

  const {
    control: scheduleControl,
    getValues: scheduleGetValues,
    formState: scheduleFromState,
  } = useForm<{
    schedule: WeekdaySchedule[];
  }>({
    defaultValues: {
      schedule: [
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
  });

  const {
    control: advantagesControl,
    getValues: advantagesGetValues,
    formState: advantagesFromState,
  } = useForm<{
    advantages: string[];
  }>({
    defaultValues: { advantages: [] },
  });

  const {
    control: contactControl,
    getValues: contactGetValues,
    formState: contactFromState,
  } = useForm<{
    phone: string;
    email: string;
    instagram: string;
  }>({
    defaultValues: { phone: '', email: '', instagram: '' },
  });

  const onFinish = useCallback(async () => {
    const { name } = nameGetValues();
    const { country, usState } = countryGetValues();
    const { currency } = currencyGetValues();
    const { address, entrance, floor, remark } = addressGetValues();
    const { schedule } = scheduleGetValues();
    const { advantages } = advantagesGetValues();
    const { phone, email, instagram } = contactGetValues();

    await mutateAsync({
      name,
      country,
      usState,
      address,
      entrance,
      floor,
      remark,
      advantages,
      schedules: schedule,
      currencies: currency ? [currency] : [],
      phones: phone ? [phone] : [],
      emails: email ? [email] : [],
      instagrams: instagram ? [instagram] : [],
    });

    createdRef.current = true;

    router.dismissTo('/locations');
  }, [
    addressGetValues,
    advantagesGetValues,
    contactGetValues,
    countryGetValues,
    currencyGetValues,
    mutateAsync,
    nameGetValues,
    scheduleGetValues,
  ]);

  const onLeave = useCallback(
    (e: EventArg<'beforeRemove', true, { action: NavigationAction }>) => {
      if (createdRef.current) return;

      e.preventDefault();

      ConfirmAlert({
        title: t('brand_location.create.discard.title'),
        message: t('brand_location.create.discard.message'),
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

  return (
    <Survey loading={isPending || createdRef.current} onFinish={onFinish}>
      <SurveyStep
        canGoNext={nameFormState.isValid}
        title={t('brand_location.create.steps.name.title')}
        subtitle={t('brand_location.create.steps.name.subtitle')}
      >
        <BrandLocationNameController
          noLabel
          name="name"
          control={nameControl}
        />
      </SurveyStep>

      {brand?.countries && brand.countries.length > 1 && (
        <SurveyStep
          canGoNext={countryFormState.isValid}
          title={t('brand_location.create.steps.country.title')}
          subtitle={t('brand_location.create.steps.country.subtitle')}
        >
          <BrandLocationCountryController
            noLabel
            name="country"
            control={countryControl}
          />

          {country === 'US' && (
            <BrandLocationUsStateController
              name="usState"
              control={countryControl}
            />
          )}
        </SurveyStep>
      )}

      {brand?.currencies && brand.currencies.length > 1 && (
        <SurveyStep
          canGoNext={currencyFormState.isValid}
          title={t('brand_location.create.steps.currency.title')}
          subtitle={t('brand_location.create.steps.currency.subtitle')}
        >
          <BrandLocationCurrencyController
            noLabel
            name="currency"
            control={currencyControl}
          />
        </SurveyStep>
      )}

      <SurveyStep
        canGoNext={addressFormState.isValid}
        title={t('brand_location.create.steps.address.title')}
        subtitle={t('brand_location.create.steps.address.subtitle')}
      >
        <BrandLocationAddressController
          noLabel
          name="address"
          control={addressControl}
        />
        <BrandLocationEntranceController
          name="entrance"
          control={addressControl}
        />
        <BrandLocationFloorController name="floor" control={addressControl} />
        <BrandLocationRemarkController name="remark" control={addressControl} />
      </SurveyStep>

      <SurveyStep
        canGoNext={scheduleFromState.isValid}
        title={t('brand_location.create.steps.schedule.title')}
        subtitle={t('brand_location.create.steps.schedule.subtitle')}
      >
        <BrandLocationScheduleController
          name="schedule"
          control={scheduleControl}
        />
      </SurveyStep>

      <SurveyStep
        skippable
        canGoNext={advantagesFromState.isValid}
        title={t('brand_location.create.steps.advantages.title')}
        subtitle={t('brand_location.create.steps.advantages.subtitle')}
      >
        <BrandLocationAdvantagesController
          noLabel
          required
          name="advantages"
          control={advantagesControl}
        />
      </SurveyStep>

      <SurveyStep
        skippable
        canGoNext={contactFromState.isValid}
        title={t('brand_location.create.steps.contact.title')}
        subtitle={t('brand_location.create.steps.contact.subtitle')}
      >
        <BrandLocationPhoneController
          required
          name="phone"
          control={contactControl}
        />
        <BrandLocationEmailController name="email" control={contactControl} />
        <BrandLocationInstagramController
          name="instagram"
          control={contactControl}
        />
      </SurveyStep>
    </Survey>
  );
};
