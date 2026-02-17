import {
  BrandBookingFrequency,
  BrandBookingType,
  BrandEmployee,
  useBrandBookingSlotsByServiceReq,
  useCreateServiceBrandBookingReq,
} from '@symbiot-core-apps/api';
import { useCurrentBrandBookingsState } from '@symbiot-core-apps/state';
import { useForm } from 'react-hook-form';
import { useCallback } from 'react';
import { DateHelper, useI18n, useRateApp } from '@symbiot-core-apps/shared';
import { Survey, SurveyStep } from '@symbiot-core-apps/ui';
import { BrandBookingServicesController } from './controller/brand-booking-services-controller';
import { ServiceBrandBookingScheduleController } from './controller/service-brand-booking-schedule-controller';
import { BrandBookingFrequencyController } from './controller/brand-booking-frequency-controller';
import { BrandBookingRemindersController } from './controller/brand-booking-reminders-controller';
import { getSlotsRandomEmployee } from '../utils/get-slots-random-employee';

export const CreateServiceBrandBooking = ({ start }: { start: Date }) => {
  const { t } = useI18n();
  const { mutateAsync: createBooking, isPending: isBookingLoading } =
    useCreateServiceBrandBookingReq();
  const { addBookings } = useCurrentBrandBookingsState();
  const { rate: rateApp } = useRateApp();

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
      throw new Error('No slots found');
    }

    const employee =
      schedule.employee ||
      getSlotsRandomEmployee({ slots, start, locationId: schedule.location });

    if (!employee) throw new Error('No employee found');

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

    addBookings(bookings);

    return {
      replaceUrl: `/bookings/${BrandBookingType.service}/${bookings[0].id}/profile`,
      postCallback: rateApp,
    };
  }, [
    rateApp,
    createBooking,
    recurrenceGetValues,
    scheduleGetValues,
    servicesGetValues,
    slots,
    addBookings,
  ]);

  return (
    <Survey
      loading={isBookingLoading}
      leaveAlertParams={{
        title: t(`service_brand_booking.create.discard.title`),
        subtitle: t(`service_brand_booking.create.discard.message`),
      }}
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
