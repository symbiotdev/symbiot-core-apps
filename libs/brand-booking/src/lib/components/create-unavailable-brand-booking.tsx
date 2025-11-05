import { useTranslation } from 'react-i18next';
import {
  BrandBookingFrequency,
  BrandBookingType,
  useCreateUnavailableBrandBookingReq,
} from '@symbiot-core-apps/api';
import { router, useNavigation } from 'expo-router';
import { useCallback, useEffect, useRef } from 'react';
import { EventArg, NavigationAction } from '@react-navigation/native';
import { ConfirmAlert, DateHelper } from '@symbiot-core-apps/shared';
import { Survey, SurveyStep } from '@symbiot-core-apps/ui';
import { useForm } from 'react-hook-form';
import { UnavailableBrandBookingDatetimeController } from './controller/unavailable-brand-booking-datetime-controller';
import { FrequencyBrandBookingController } from './controller/frequency-brand-booking-controller';
import { EmployeesBrandBookingController } from './controller/employees-brand-booking-controller';
import { UnavailableBrandBookingReasonController } from './controller/unavailable-brand-booking-reason-controller';
import { useCurrentBrandBookingsState } from '@symbiot-core-apps/state';

export const CreateUnavailableBrandBooking = ({ start }: { start: Date }) => {
  const { t } = useTranslation();
  const { mutateAsync: createBooking, isPending: isBookingLoading } =
    useCreateUnavailableBrandBookingReq();
  const navigation = useNavigation();
  const { upsertBookings } = useCurrentBrandBookingsState();

  const createdRef = useRef(false);

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
          : DateHelper.addMinutes(start, 30),
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

  const {
    control: employeesControl,
    getValues: employeesGetValues,
    formState: employeesFormState,
  } = useForm<{
    employee: string;
  }>({
    defaultValues: {
      employee: undefined,
    },
  });

  const {
    control: reasonControl,
    getValues: reasonGetValues,
    formState: reasonFormState,
  } = useForm<{
    reason: string;
  }>({
    defaultValues: {
      reason: '',
    },
  });

  const onFinish = useCallback(async () => {
    const { datetime } = datetimeGetValues();
    const { frequency } = recurrenceGetValues();
    const { employee } = employeesGetValues();
    const { reason } = reasonGetValues();

    const bookings = await createBooking({
      start: datetime.start,
      end: frequency.endDate,
      frequency: frequency.type,
      duration: DateHelper.differenceInMinutes(datetime.end, datetime.start),
      reason,
      locations: [],
      employees: [employee],
    });

    createdRef.current = true;

    upsertBookings(bookings);

    router.replace(
      `/bookings/${BrandBookingType.unavailable}/${bookings[0].id}/profile`,
    );
  }, [
    datetimeGetValues,
    recurrenceGetValues,
    employeesGetValues,
    reasonGetValues,
    createBooking,
    upsertBookings,
  ]);

  const onLeave = useCallback(
    (e: EventArg<'beforeRemove', true, { action: NavigationAction }>) => {
      if (createdRef.current) return;

      e.preventDefault();

      ConfirmAlert({
        title: t(`unavailable_brand_booking.create.discard.title`),
        message: t(`unavailable_brand_booking.create.discard.message`),
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
        <FrequencyBrandBookingController
          name="frequency"
          control={recurrenceControl}
          minDate={DateHelper.addDays(datetime.start, 1)}
        />
      </SurveyStep>

      <SurveyStep
        canGoNext={employeesFormState.isValid}
        title={t(`unavailable_brand_booking.create.steps.employee.title`)}
        subtitle={t(`unavailable_brand_booking.create.steps.employee.subtitle`)}
      >
        <EmployeesBrandBookingController
          name="employee"
          control={employeesControl}
        />
      </SurveyStep>

      <SurveyStep
        skippable
        canGoNext={reasonFormState.isValid}
        title={t(`unavailable_brand_booking.create.steps.reason.title`)}
        subtitle={t(`unavailable_brand_booking.create.steps.reason.subtitle`)}
      >
        <UnavailableBrandBookingReasonController
          noLabel
          required
          name="reason"
          control={reasonControl}
        />
      </SurveyStep>
    </Survey>
  );
};
