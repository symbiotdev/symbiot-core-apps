import { useTranslation } from 'react-i18next';
import {
  BrandBookingFrequency,
  BrandBookingType,
  BrandEmployee,
  useBrandBookingSlotsByServiceReq,
  useCreateServiceBrandBookingReq,
} from '@symbiot-core-apps/api';
import { router, useNavigation } from 'expo-router';
import { useCurrentBrandBookingsState } from '@symbiot-core-apps/state';
import { useForm } from 'react-hook-form';
import { useCallback, useEffect, useRef } from 'react';
import { EventArg, NavigationAction } from '@react-navigation/native';
import { ConfirmAlert, DateHelper } from '@symbiot-core-apps/shared';
import { Survey, SurveyStep } from '@symbiot-core-apps/ui';
import { BrandBookingServicesController } from './controller/brand-booking-services-controller';
import { ServiceBrandBookingScheduleController } from './controller/service-brand-booking-schedule-controller';
import { BrandBookingFrequencyController } from './controller/brand-booking-frequency-controller';
import { BrandBookingRemindersController } from './controller/brand-booking-reminders-controller';

export const CreateServiceBrandBooking = ({ start }: { start: Date }) => {
  const { t } = useTranslation();
  const { mutateAsync: createBooking, isPending: isBookingLoading } =
    useCreateServiceBrandBookingReq();
  const navigation = useNavigation();
  const { upsertBookings } = useCurrentBrandBookingsState();

  const createdRef = useRef(false);

  const {
    control: servicesControl,
    getValues: servicesGetValues,
    formState: servicesFormState,
    watch: servicesWatch,
  } = useForm<{
    details: {
      service: string;
      note: string;
    };
  }>({
    defaultValues: {
      details: {
        service: undefined,
        note: '',
      },
    },
  });

  const {
    control: scheduleControl,
    getValues: scheduleGetValues,
    formState: scheduleFormState,
    watch: scheduleWatch,
  } = useForm<{
    schedule: {
      date: Date;
      providers: BrandEmployee[];
      location?: string;
      employee?: string;
      start?: number;
    };
  }>({
    defaultValues: {
      schedule: {
        date: start || new Date(),
        providers: [],
      },
    },
  });

  const {
    control: recurrenceControl,
    getValues: recurrenceGetValues,
    formState: recurrenceFormState,
  } = useForm<{
    frequency: {
      type: BrandBookingFrequency;
      endDate?: Date;
    };
    reminders: number[];
  }>({
    defaultValues: {
      frequency: {
        type: BrandBookingFrequency.noRepeat,
      },
      reminders: [],
    },
  });

  const { details } = servicesWatch();
  const { schedule } = scheduleWatch();
  const {
    data: slots,
    isPending: slotsLoading,
    error: slotsError,
  } = useBrandBookingSlotsByServiceReq(details.service, {
    params: {
      date: schedule.date,
    },
  });

  const onFinish = useCallback(async () => {
    const { details } = servicesGetValues();
    const { schedule } = scheduleGetValues();
    const { frequency, reminders } = recurrenceGetValues();
    const start = schedule.start;

    if (start === undefined || !slots) {
      return;
    }

    const employee =
      schedule.employee ||
      slots
        .reduce((employeeIds, { slots, location }) => {
          if (schedule.location === location?.id) {
            employeeIds.push(
              ...Object.keys(slots).filter((id) => slots[id].includes(start)),
            );
          }

          return employeeIds;
        }, [] as string[])
        .reduce((chosen, current, _, arr) =>
          Math.random() < 1 / (arr.indexOf(current) + 1) ? current : chosen,
        );

    if (!employee) return;

    const bookings = await createBooking({
      reminders,
      start: DateHelper.addMinutes(DateHelper.startOfDay(schedule.date), start),
      end: frequency.endDate,
      frequency: frequency.type,
      note: details.note,
      clients: [],
      locations: [schedule.location].filter(Boolean) as string[],
      employees: [employee],
      services: [details.service],
    });

    createdRef.current = true;

    upsertBookings(bookings);

    router.replace(
      `/bookings/${BrandBookingType.service}/${bookings[0].id}/profile`,
    );
  }, [
    createBooking,
    recurrenceGetValues,
    scheduleGetValues,
    servicesGetValues,
    slots,
    upsertBookings,
  ]);

  const onLeave = useCallback(
    (e: EventArg<'beforeRemove', true, { action: NavigationAction }>) => {
      if (createdRef.current) return;

      e.preventDefault();

      ConfirmAlert({
        title: t(`service_brand_booking.create.discard.title`),
        message: t(`service_brand_booking.create.discard.message`),
        onAgree: () => navigation.dispatch(e.data.action),
      });
    },
    [t, navigation],
  );

  useEffect(() => {
    navigation.setOptions({
      gestureEnabled: false,
      headerShown: !isBookingLoading,
    });
  }, [isBookingLoading, navigation]);

  useEffect(() => {
    navigation.addListener('beforeRemove', onLeave);

    return () => {
      navigation.removeListener('beforeRemove', onLeave);
    };
  }, [onLeave, navigation]);

  return (
    <Survey
      loading={isBookingLoading || createdRef.current}
      onFinish={onFinish}
    >
      <SurveyStep
        canGoNext={servicesFormState.isValid}
        title={t(`service_brand_booking.create.steps.service.title`)}
        subtitle={t(`service_brand_booking.create.steps.service.subtitle`)}
      >
        <BrandBookingServicesController control={servicesControl} />
      </SurveyStep>

      <SurveyStep
        canGoNext={scheduleFormState.isValid}
        title={t(`service_brand_booking.create.steps.schedule.title`)}
        subtitle={t(`service_brand_booking.create.steps.schedule.subtitle`)}
      >
        <ServiceBrandBookingScheduleController
          slots={slots}
          slotsLoading={slotsLoading}
          slotsError={slotsError}
          control={scheduleControl}
        />
      </SurveyStep>

      <SurveyStep
        canGoNext={recurrenceFormState.isValid}
        title={t(`service_brand_booking.create.steps.recurrence.title`)}
        subtitle={t(`service_brand_booking.create.steps.recurrence.subtitle`)}
      >
        <BrandBookingFrequencyController
          name="frequency"
          control={recurrenceControl}
          label={t('service_brand_booking.form.frequency.label')}
          minDate={DateHelper.addDays(schedule.date, 1)}
        />
        <BrandBookingRemindersController
          name="reminders"
          label={t('service_brand_booking.form.reminders.label')}
          control={recurrenceControl}
        />
      </SurveyStep>
    </Survey>
  );
};
