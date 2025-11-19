import {
  ContextMenuItem,
  ContextMenuPopover,
  defaultPageVerticalPadding,
  FormView,
  H1,
  Icon,
  ListItem,
  ListItemGroup,
  PageView,
  RegularText,
  SlideSheetModal,
} from '@symbiot-core-apps/ui';
import {
  BrandBookingSlot,
  BrandEmployee,
  ServiceBrandBooking,
  UpdateBrandBooking,
  UpdateServiceBrandBooking,
  useBrandBookingSlotsByServiceReq,
  useCancelServiceBrandBookingReq,
  useUpdateServiceBrandBookingReq,
} from '@symbiot-core-apps/api';
import {
  BrandEmployeeItem,
  BrandLocationItem,
  useBookingScheduleFormattedTime,
} from '@symbiot-core-apps/brand';
import { useBookingDatetime } from '../hooks/use-booking-datetime';
import { useTranslation } from 'react-i18next';
import {
  useCurrentAccountState,
  useCurrentBrandEmployee,
} from '@symbiot-core-apps/state';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react';
import { useForm } from 'react-hook-form';
import { ConfirmAlert, DateHelper, useModal } from '@symbiot-core-apps/shared';
import { ServiceBrandBookingScheduleController } from './controller/service-brand-booking-schedule-controller';
import { router, useNavigation } from 'expo-router';
import { BrandBookingNoteController } from './controller/brand-booking-note-controller';
import { getSlotsRandomEmployee } from '../utils/get-slots-random-employee';
import { useApp } from '@symbiot-core-apps/app';
import { ServiceBrandBookingProfileClients } from './service-brand-booking-profile-clients';
import { View } from 'tamagui';

export const ServiceBrandBookingProfile = ({
  booking,
}: {
  booking: ServiceBrandBooking;
}) => {
  const { t } = useTranslation();
  const { icons } = useApp();
  const { me } = useCurrentAccountState();
  const { hasPermission } = useCurrentBrandEmployee();
  const navigation = useNavigation();
  const { timezone } = useBookingDatetime({ fallbackZone: booking.timezone });
  const { mutateAsync: cancel, isPending: cancelProcessing } =
    useCancelServiceBrandBookingReq();
  const { mutateAsync: update, isPending: updateProcessing } =
    useUpdateServiceBrandBookingReq();
  const { zonedTime, localTime } = useBookingScheduleFormattedTime({
    booking,
    timezone,
  });

  const {
    visible: rescheduleModalVisible,
    open: openRescheduleModal,
    close: closeRescheduleModal,
  } = useModal();
  const {
    visible: serviceNoteModalVisible,
    open: openServiceNoteModal,
    close: closeServiceNoteModal,
  } = useModal();

  const getRecurring = useCallback(
    () =>
      new Promise<boolean>((resolve) => {
        if (booking.repetitive) {
          ConfirmAlert({
            title: t('service_brand_booking.profile.update_recurring'),
            cancelText: t('shared.no'),
            confirmText: t('shared.yes'),
            onCancel: () => resolve(false),
            onAgree: () => resolve(true),
          });
        } else {
          resolve(false);
        }
      }),
    [booking.repetitive, t],
  );

  const onUpdate = useCallback(
    async (data: UpdateBrandBooking) => {
      void update({
        id: booking.id,
        data: {
          ...data,
          recurring: await getRecurring(),
        },
      });
    },
    [booking.id, getRecurring, update],
  );

  const contextMenuItems: ContextMenuItem[] = useMemo(
    () => [
      {
        label: t(`service_brand_booking.profile.context_menu.reschedule.label`),
        icon: <Icon name="CalendarCross" />,
        onPress: openRescheduleModal,
      },
      {
        label: t(
          `service_brand_booking.profile.context_menu.change_note.label`,
        ),
        icon: <Icon name="InfoCircle" />,
        onPress: openServiceNoteModal,
      },
      {
        label: t(`service_brand_booking.profile.context_menu.cancel.label`),
        icon: <Icon name="Close" />,
        color: '$error',
        onPress: async () =>
          cancel({
            id: booking.id,
            recurring: await getRecurring(),
          }),
      },
    ],
    [
      t,
      openRescheduleModal,
      openServiceNoteModal,
      cancel,
      booking.id,
      getRecurring,
    ],
  );

  const headerRight = useCallback(
    () =>
      !!booking?.id &&
      !booking?.cancelAt &&
      hasPermission('bookings') && (
        <ContextMenuPopover
          loading={cancelProcessing || updateProcessing}
          disabled={cancelProcessing || updateProcessing}
          items={contextMenuItems}
        />
      ),
    [
      booking?.id,
      booking?.cancelAt,
      hasPermission,
      cancelProcessing,
      updateProcessing,
      contextMenuItems,
    ],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t(`service_brand_booking.profile.title`),
      headerRight,
    });
  }, [navigation, t, headerRight]);

  return (
    <>
      <PageView scrollable withHeaderHeight>
        <FormView gap="$5">
          <View gap="$2">
            <H1>{booking.name}</H1>

            <ListItem
              textNumberOfLines={2}
              icon={<Icon name={icons.ServiceBooking} />}
              label={DateHelper.format(
                booking.start,
                `EEEE ${me?.preferences?.dateFormat}`,
              )}
              text={`${zonedTime}${localTime ? `\n${t('shared.local_time')}: ${localTime}` : ''}`}
            />
          </View>

          {!!booking.locations?.length && (
            <ListItemGroup
              gap="$4"
              paddingVertical="$4"
              title={t('service_brand_booking.profile.location')}
            >
              {booking.locations.map((location) => (
                <BrandLocationItem
                  key={location.id}
                  location={location}
                  onPress={() =>
                    router.push(`/locations/${location.id}/profile`)
                  }
                />
              ))}
            </ListItemGroup>
          )}

          <ListItemGroup
            gap="$4"
            paddingVertical="$4"
            title={t('service_brand_booking.profile.employee')}
          >
            {booking.employees.map((employee) => (
              <BrandEmployeeItem
                key={employee.id}
                employee={employee}
                onPress={() => router.push(`/employees/${employee.id}/profile`)}
              />
            ))}
          </ListItemGroup>

          {!!booking.note && (
            <ListItemGroup
              paddingVertical="$4"
              title={t(`service_brand_booking.profile.note`)}
            >
              <RegularText>{booking.note}</RegularText>
            </ListItemGroup>
          )}

          <ServiceBrandBookingProfileClients booking={booking} />
        </FormView>
      </PageView>

      <SlideSheetModal
        scrollable
        headerTitle={t(`service_brand_booking.profile.reschedule`)}
        visible={rescheduleModalVisible}
        onClose={closeRescheduleModal}
      >
        <FormView gap="$5" paddingVertical={defaultPageVerticalPadding}>
          <RescheduleForm booking={booking} onUpdate={onUpdate} />
        </FormView>
      </SlideSheetModal>

      <SlideSheetModal
        scrollable
        headerTitle={t(`service_brand_booking.profile.note`)}
        visible={serviceNoteModalVisible}
        onClose={closeServiceNoteModal}
      >
        <FormView gap="$5" paddingVertical={defaultPageVerticalPadding}>
          <NoteForm booking={booking} onUpdate={onUpdate} />
        </FormView>
      </SlideSheetModal>
    </>
  );
};

const RescheduleForm = ({
  booking,
  onUpdate,
}: {
  booking: ServiceBrandBooking;
  onUpdate: (data: UpdateBrandBooking) => Promise<void>;
}) => {
  const { timezone } = useBookingDatetime({ fallbackZone: booking.timezone });
  const slotsRef = useRef<BrandBookingSlot[]>([]);

  const initialSchedule = useMemo(
    () => ({
      date: DateHelper.toDate(
        DateHelper.startOfDay(DateHelper.toZonedTime(booking.start, timezone)),
      ),
      providers: [],
      location: booking.locations?.[0]?.id,
      employee: booking.employees?.[0]?.id,
      start: DateHelper.differenceInMinutes(
        booking.start,
        DateHelper.startOfDay(booking.start),
      ),
    }),
    [booking.employees, booking.locations, booking.start, timezone],
  );

  const { control, watch, getValues } = useForm<{
    schedule: {
      date: Date;
      providers: BrandEmployee[];
      location?: string;
      employee?: string;
      start?: number;
    };
  }>({
    defaultValues: {
      schedule: initialSchedule,
    },
  });

  const {
    data: slots,
    isPending: slotsLoading,
    error: slotsError,
  } = useBrandBookingSlotsByServiceReq(booking.services[0].id, {
    params: {
      date: watch().schedule.date,
    },
  });

  useEffect(() => {
    if (slots) {
      slotsRef.current = slots;
    }
  }, [slots]);

  useEffect(() => {
    return () => {
      const updateValues: UpdateServiceBrandBooking = {};

      const { schedule } = getValues();
      const start = schedule.start;

      if (start === undefined) return;

      const startDate = DateHelper.addMinutes(schedule.date, start);
      const employee =
        schedule.employee ||
        getSlotsRandomEmployee({
          start,
          slots: slotsRef.current,
          locationId: schedule.location,
        });

      if (!DateHelper.isSame(startDate, booking.start)) {
        updateValues.start = DateHelper.fromZonedTime(startDate, timezone);
      }

      if (schedule.location !== initialSchedule.location) {
        updateValues.locations = [schedule.location].filter(
          Boolean,
        ) as string[];
      }

      if (employee && initialSchedule.employee !== employee) {
        updateValues.employees = [employee];
      }

      void onUpdate(updateValues);
    };
  }, [
    onUpdate,
    timezone,
    getValues,
    booking.start,
    initialSchedule.start,
    initialSchedule.location,
    initialSchedule.employee,
  ]);

  return (
    <ServiceBrandBookingScheduleController
      slots={slots}
      slotsLoading={slotsLoading}
      slotsError={slotsError}
      control={control}
    />
  );
};

const NoteForm = ({
  booking,
  onUpdate,
}: {
  booking: ServiceBrandBooking;
  onUpdate: (data: UpdateBrandBooking) => Promise<void>;
}) => {
  const { t } = useTranslation();
  const { control, getValues } = useForm<{ note: string }>({
    defaultValues: {
      note: booking.note || '',
    },
  });

  const emitUpdate = useCallback(() => {
    const { note } = getValues();

    if (note?.trim() === booking.note?.trim()) return;

    void onUpdate({
      note,
    });
  }, [getValues, booking.note, onUpdate]);

  return (
    <BrandBookingNoteController
      name="note"
      control={control}
      placeholder={t(`service_brand_booking.form.note.placeholder`)}
      onBlur={emitUpdate}
    />
  );
};
