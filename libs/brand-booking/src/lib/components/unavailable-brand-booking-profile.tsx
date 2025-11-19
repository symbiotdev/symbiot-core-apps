import {
  ContextMenuItem,
  ContextMenuPopover,
  defaultPageVerticalPadding,
  FormView,
  H1,
  Icon,
  ListItem,
  ListItemGroup,
  MediumText,
  PageView,
  RegularText,
  SlideSheetModal,
} from '@symbiot-core-apps/ui';
import {
  UnavailableBrandBooking,
  UpdateBrandBooking,
  useCancelUnavailableBrandBookingReq,
  useUpdateUnavailableBrandBookingReq,
} from '@symbiot-core-apps/api';
import {
  BrandEmployeeItem,
  useBookingScheduleFormattedTime,
} from '@symbiot-core-apps/brand';
import { router, useNavigation } from 'expo-router';
import { useTranslation } from 'react-i18next';
import React, { useCallback, useLayoutEffect, useMemo } from 'react';
import { ConfirmAlert, DateHelper, useModal } from '@symbiot-core-apps/shared';
import {
  useCurrentAccountState,
  useCurrentBrandEmployee,
} from '@symbiot-core-apps/state';
import { useForm } from 'react-hook-form';
import { UnavailableBrandBookingDatetimeController } from './controller/unavailable-brand-booking-datetime-controller';
import { BrandBookingNoteController } from './controller/brand-booking-note-controller';
import { useBookingDatetime } from '../hooks/use-booking-datetime';
import { useApp } from '@symbiot-core-apps/app';
import { View, XStack } from 'tamagui';

export const UnavailableBrandBookingProfile = ({
  booking,
}: {
  booking: UnavailableBrandBooking;
}) => {
  const { icons } = useApp();
  const { t } = useTranslation();
  const { me } = useCurrentAccountState();
  const { hasPermission } = useCurrentBrandEmployee();
  const navigation = useNavigation();
  const { timezone } = useBookingDatetime({ fallbackZone: booking.timezone });
  const { mutateAsync: cancel, isPending: cancelProcessing } =
    useCancelUnavailableBrandBookingReq();
  const { mutateAsync: update, isPending: updateProcessing } =
    useUpdateUnavailableBrandBookingReq();
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
    visible: noteModalVisible,
    open: openNoteModal,
    close: closeNoteModal,
  } = useModal();

  const getRecurring = useCallback(
    () =>
      new Promise<boolean>((resolve) => {
        if (booking.repetitive) {
          ConfirmAlert({
            title: t('unavailable_brand_booking.profile.update_recurring'),
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
        label: t(
          `unavailable_brand_booking.profile.context_menu.reschedule.label`,
        ),
        icon: <Icon name="CalendarCross" />,
        onPress: openRescheduleModal,
      },
      {
        label: t(
          `unavailable_brand_booking.profile.context_menu.change_reason.label`,
        ),
        icon: <Icon name="InfoCircle" />,
        onPress: openNoteModal,
      },
      {
        label: t(`unavailable_brand_booking.profile.context_menu.cancel.label`),
        icon: <Icon name="Close" />,
        color: '$error',
        onPress: async () =>
          cancel({
            id: booking.id,
            recurring: await getRecurring(),
          }),
      },
    ],
    [t, openRescheduleModal, openNoteModal, cancel, booking.id, getRecurring],
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
      headerRight,
    });
  }, [navigation, headerRight]);

  return (
    <>
      <PageView scrollable withHeaderHeight>
        <FormView gap="$4">
          <View gap="$2">
            <H1
              textDecorationLine={booking.cancelAt ? 'line-through' : undefined}
            >
              {t(`unavailable_brand_booking.profile.title`)}
            </H1>

            {!!booking.cancelAt && (
              <XStack gap="$1">
                <Icon name="Close" color="$error" />
                <MediumText color="$error" alignSelf="center">
                  {t('shared.canceled')}
                </MediumText>
              </XStack>
            )}

            <ListItem
              alignItems="flex-start"
              textNumberOfLines={2}
              icon={
                <Icon
                  name={icons.UnavailableBooking}
                  style={{ marginTop: 8 }}
                />
              }
              label={DateHelper.format(
                booking.start,
                me?.preferences?.dateFormat,
              )}
              text={`${zonedTime}${localTime ? ` (${t('shared.local_time')}: ${localTime})` : ''}`}
            />
          </View>

          <ListItemGroup
            gap="$4"
            paddingVertical="$4"
            title={t('unavailable_brand_booking.profile.employee')}
          >
            {booking.employees.map((employee) => (
              <BrandEmployeeItem
                key={employee.id}
                employee={employee}
                onPress={() => router.push(`/employees/${employee.id}/profile`)}
              />
            ))}
          </ListItemGroup>

          <ListItemGroup
            paddingVertical="$4"
            title={t(`unavailable_brand_booking.profile.note`)}
          >
            <RegularText>
              {booking.note || t('shared.not_specified')}
            </RegularText>
          </ListItemGroup>
        </FormView>
      </PageView>

      <SlideSheetModal
        scrollable
        headerTitle={t(`unavailable_brand_booking.profile.datetime`)}
        visible={rescheduleModalVisible}
        onClose={closeRescheduleModal}
      >
        <FormView gap="$5" paddingVertical={defaultPageVerticalPadding}>
          <RescheduleForm booking={booking} onUpdate={onUpdate} />
        </FormView>
      </SlideSheetModal>

      <SlideSheetModal
        scrollable
        headerTitle={t(`unavailable_brand_booking.profile.note`)}
        visible={noteModalVisible}
        onClose={closeNoteModal}
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
  booking: UnavailableBrandBooking;
  onUpdate: (data: UpdateBrandBooking) => Promise<void>;
}) => {
  const { timezone } = useBookingDatetime({ fallbackZone: booking.timezone });

  const { control: datetimeControl, getValues: datetimeGetValues } = useForm<{
    datetime: {
      start: Date;
      end: Date;
    };
  }>({
    defaultValues: {
      datetime: {
        start: DateHelper.toZonedTime(booking.start, timezone),
        end: DateHelper.toZonedTime(booking.end, timezone),
      },
    },
  });

  const emitUpdate = useCallback(async () => {
    const { datetime } = datetimeGetValues();

    if (
      DateHelper.isSame(
        booking.start,
        DateHelper.fromZonedTime(datetime.start, timezone),
      ) &&
      DateHelper.isSame(
        booking.end,
        DateHelper.fromZonedTime(datetime.end, timezone),
      )
    ) {
      return;
    }

    void onUpdate({
      start: DateHelper.fromZonedTime(datetime.start, timezone),
      duration: DateHelper.differenceInMinutes(datetime.end, datetime.start),
    });
  }, [booking.end, booking.start, timezone, datetimeGetValues, onUpdate]);

  return (
    <UnavailableBrandBookingDatetimeController
      disableDrag
      control={datetimeControl}
      onBlur={emitUpdate}
    />
  );
};

const NoteForm = ({
  booking,
  onUpdate,
}: {
  booking: UnavailableBrandBooking;
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
      placeholder={t(`unavailable_brand_booking.form.note.placeholder`)}
      onBlur={emitUpdate}
    />
  );
};
