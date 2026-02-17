import {
  BrandBookingFrequency,
  BrandBookingType,
  useCreateUnavailableBrandBookingReq,
} from '@symbiot-core-apps/api';
import { useCallback } from 'react';
import { DateHelper, useI18n, useRateApp } from '@symbiot-core-apps/shared';
import { Survey, SurveyStep } from '@symbiot-core-apps/ui';
import { useForm } from 'react-hook-form';
import { UnavailableBrandBookingDatetimeController } from './controller/unavailable-brand-booking-datetime-controller';
import { BrandBookingFrequencyController } from './controller/brand-booking-frequency-controller';
import { BrandBookingEmployeesController } from './controller/brand-booking-employees-controller';
import {
  useCurrentBrandBookingsState,
  useCurrentBrandEmployee,
} from '@symbiot-core-apps/state';

export const CreateUnavailableBrandBooking = ({ start }: { start: Date }) => {
  const { t } = useI18n();
  const { mutateAsync: createBooking, isPending: isBookingLoading } =
    useCreateUnavailableBrandBookingReq();
  const { addBookings } = useCurrentBrandBookingsState();
  const { currentEmployee } = useCurrentBrandEmployee();
  const { rate: rateApp } = useRateApp();

  const {
    control: employeesControl,
    getValues: employeesGetValues,
    formState: employeesFormState,
  } = useForm<{
    details: {
      employee: string;
      note: string;
    };
  }>({
    defaultValues: {
      details: {
        employee: currentEmployee?.id,
        note: '',
      },
    },
  });

  const {
    control: datetimeControl,
    getValues: datetimeGetValues,
    formState: datetimeFormState,
    watch: datetimeWatch,
  } = useForm<{
    datetime: {
      start: Date;
      end: Date;
    };
  }>({
    defaultValues: {
      datetime: {
        start,
        end: DateHelper.isSame(DateHelper.startOfDay(start), start)
          ? start
          : DateHelper.addMinutes(start, 60),
      },
    },
  });

  const { datetime } = datetimeWatch();

  const {
    control: recurrenceControl,
    getValues: recurrenceGetValues,
    formState: recurrenceFormState,
  } = useForm<{
    frequency: {
      type: BrandBookingFrequency;
      endDate?: Date;
    };
  }>({
    defaultValues: {
      frequency: {
        type: BrandBookingFrequency.noRepeat,
      },
    },
  });

  const onFinish = useCallback(async () => {
    const { datetime } = datetimeGetValues();
    const { frequency } = recurrenceGetValues();
    const { details } = employeesGetValues();

    const bookings = await createBooking({
      start: datetime.start,
      end: frequency.endDate,
      frequency: frequency.type,
      note: details.note,
      duration: DateHelper.differenceInMinutes(datetime.end, datetime.start),
      locations: [],
      employees: [details.employee],
    });

    addBookings(bookings);

    return {
      replaceUrl: `/bookings/${BrandBookingType.unavailable}/${bookings[0].id}/profile`,
      postCallback: rateApp,
    };
  }, [
    rateApp,
    datetimeGetValues,
    recurrenceGetValues,
    employeesGetValues,
    createBooking,
    addBookings,
  ]);

  return (
    <Survey
      loading={isBookingLoading}
      leaveAlertParams={{
        title: t(`unavailable_brand_booking.create.discard.title`),
        subtitle: t(`unavailable_brand_booking.create.discard.message`),
      }}
      onFinish={onFinish}
    >
      <SurveyStep
        canGoNext={employeesFormState.isValid}
        title={t(`unavailable_brand_booking.create.steps.employee.title`)}
        subtitle={t(`unavailable_brand_booking.create.steps.employee.subtitle`)}
      >
        <BrandBookingEmployeesController control={employeesControl} />
      </SurveyStep>

      <SurveyStep
        canGoNext={datetimeFormState.isValid}
        title={t(`unavailable_brand_booking.create.steps.datetime.title`)}
        subtitle={t(`unavailable_brand_booking.create.steps.datetime.subtitle`)}
      >
        <UnavailableBrandBookingDatetimeController control={datetimeControl} />
      </SurveyStep>

      <SurveyStep
        canGoNext={recurrenceFormState.isValid}
        title={t(`unavailable_brand_booking.create.steps.recurrence.title`)}
        subtitle={t(
          `unavailable_brand_booking.create.steps.recurrence.subtitle`,
        )}
      >
        <BrandBookingFrequencyController
          name="frequency"
          control={recurrenceControl}
          minDate={DateHelper.addDays(datetime.start, 1)}
        />
      </SurveyStep>
    </Survey>
  );
};
