import { useTranslation } from 'react-i18next';
import {
  BookingRepeatType,
  BrandBookingType,
  getDatesByRepeatType,
  useCreateUnavailableBrandBookingReq,
} from '@symbiot-core-apps/api';
import { router, useNavigation } from 'expo-router';
import { useCallback, useEffect, useRef } from 'react';
import { EventArg, NavigationAction } from '@react-navigation/native';
import { ConfirmAlert, DateHelper } from '@symbiot-core-apps/shared';
import { Survey, SurveyStep } from '@symbiot-core-apps/ui';
import { useForm } from 'react-hook-form';
import { UnavailableBrandBookingDatetimeController } from './controller/unavailable-brand-booking-datetime-controller';
import { RepeatBrandBookingController } from './controller/repeat-brand-booking-controller';
import { EmployeesBrandBookingController } from './controller/employees-brand-booking-controller';
import { UnavailableBrandBookingReasonController } from './controller/unavailable-brand-booking-reason-controller';

export const CreateUnavailableBrandBooking = ({ start }: { start: Date }) => {
  const { t } = useTranslation();
  const { mutateAsync: createBooking, isPending: isBookingLoading } =
    useCreateUnavailableBrandBookingReq();
  const navigation = useNavigation();

  const createdRef = useRef(false);

  const {
    control: datetimeControl,
    getValues: datetimeGetValues,
    formState: datetimeFormState,
    watch: datetimeWatch,
  } = useForm<{
    duration: {
      start: Date;
      end: Date;
    };
  }>({
    defaultValues: {
      duration: {
        start,
        end: DateHelper.isSame(DateHelper.startOfDay(start), start)
          ? start
          : DateHelper.addMinutes(start, 30),
      },
    },
  });

  const { duration } = datetimeWatch();

  const {
    control: repeatControl,
    getValues: repeatGetValues,
    formState: repeatFormState,
  } = useForm<{
    repeat: { type: BookingRepeatType; endDate?: Date };
  }>({
    defaultValues: {
      repeat: {
        type: BookingRepeatType.noRepeat,
        endDate: undefined,
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
    const { duration } = datetimeGetValues();
    const { repeat } = repeatGetValues();
    const { employee } = employeesGetValues();
    const { reason } = reasonGetValues();

    const booking = await createBooking({
      start: getDatesByRepeatType({
        type: repeat.type,
        start: duration.start,
        end: repeat.endDate || duration.end,
      }),
      duration: DateHelper.differenceInMinutes(duration.end, duration.start),
      reason,
      locations: [],
      employees: [employee],
    });

    createdRef.current = true;

    router.replace(
      `/bookings/${BrandBookingType.unavailable}/${booking[0].id}/profile`,
    );
  }, [
    createBooking,
    datetimeGetValues,
    employeesGetValues,
    reasonGetValues,
    repeatGetValues,
  ]);

  const onLeave = useCallback(
    (e: EventArg<'beforeRemove', true, { action: NavigationAction }>) => {
      if (createdRef.current) return;

      e.preventDefault();

      ConfirmAlert({
        title: t(`unavailable_brand_booking.create.discard.title`),
        message: t(`unavailable_brand_booking.create.discard.message`),
        callback: () => navigation.dispatch(e.data.action),
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
        canGoNext={repeatFormState.isValid}
        title={t(`unavailable_brand_booking.create.steps.repeat.title`)}
        subtitle={t(`unavailable_brand_booking.create.steps.repeat.subtitle`)}
      >
        <RepeatBrandBookingController
          control={repeatControl}
          minDate={DateHelper.addDays(duration.start, 1)}
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
