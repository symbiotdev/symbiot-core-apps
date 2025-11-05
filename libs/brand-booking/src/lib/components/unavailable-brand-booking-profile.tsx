import {
  defaultPageVerticalPadding,
  FormView,
  Icon,
  ListItem,
  ListItemGroup,
  PageView,
  SlideSheetModal,
} from '@symbiot-core-apps/ui';
import {
  AnyBrandBooking,
  isBrandBookingAllDay,
  UnavailableBrandBooking,
  UpdateBrandBooking,
  useModalUpdateByIdForm,
  useUpdateUnavailableBrandBookingReq,
} from '@symbiot-core-apps/api';
import { BrandBookingItem, BrandEmployeeItem } from '@symbiot-core-apps/brand';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import React, { useCallback } from 'react';
import { ConfirmAlert, DateHelper, useModal } from '@symbiot-core-apps/shared';
import {
  useCurrentAccountState,
  useCurrentBrandEmployee,
} from '@symbiot-core-apps/state';
import { useApp } from '@symbiot-core-apps/app';
import { SingeElementForm } from '@symbiot-core-apps/form-controller';
import { useForm } from 'react-hook-form';
import { UnavailableBrandBookingDatetimeController } from './controller/unavailable-brand-booking-datetime-controller';
import { BrandBookingNoteController } from './controller/brand-booking-note-controller';

export const UnavailableBrandBookingProfile = ({
  booking,
}: {
  booking: UnavailableBrandBooking;
}) => {
  const { t } = useTranslation();

  return (
    <PageView scrollable withHeaderHeight>
      <FormView gap="$4">
        <BrandBookingItem padding="$4" borderRadius="$10" booking={booking} />

        {!!booking.employees?.length && (
          <ListItemGroup
            gap="$4"
            paddingVertical="$4"
            title={t('unavailable_brand_booking.profile.employees')}
          >
            {booking.employees.map((employee) => (
              <BrandEmployeeItem
                key={employee.id}
                employee={employee}
                onPress={() => router.push(`/employees/${employee.id}/profile`)}
              />
            ))}
          </ListItemGroup>
        )}

        <ListItemGroup title={t('unavailable_brand_booking.profile.settings')}>
          {!booking.cancelAt && <DateTime booking={booking} />}

          <Note booking={booking} />
        </ListItemGroup>
      </FormView>
    </PageView>
  );
};

const DateTime = ({ booking }: { booking: UnavailableBrandBooking }) => {
  const { t } = useTranslation();
  const { me } = useCurrentAccountState();
  const { currentEmployee } = useCurrentBrandEmployee();
  const { icons } = useApp();
  const { mutateAsync } = useUpdateUnavailableBrandBookingReq();
  const {
    visible: modalVisible,
    open: openModal,
    close: closeModal,
  } = useModal();

  const { control: datetimeControl, getValues: datetimeGetValues } = useForm<{
    datetime: {
      start: Date;
      end: Date;
    };
  }>({
    defaultValues: {
      datetime: {
        start: new Date(booking.start),
        end: new Date(booking.end),
      },
    },
  });

  const onUpdate = useCallback(async () => {
    let recurring = false;
    const { datetime } = datetimeGetValues();
    const start = datetime.start;

    if (
      DateHelper.isSame(booking.start, start) &&
      DateHelper.isSame(booking.end, datetime.end)
    ) {
      return;
    }

    const duration = DateHelper.differenceInMinutes(
      datetime.end,
      datetime.start,
    );

    if (booking.repetitive) {
      recurring = await new Promise((resolve) => {
        ConfirmAlert({
          title: t('unavailable_brand_booking.profile.update_recurring'),
          cancelText: t('shared.no'),
          confirmText: t('shared.yes'),
          onCancel: () => resolve(false),
          onAgree: () => {
            resolve(true);

            void mutateAsync({
              id: booking.id,
              data: {
                recurring: true,
                duration,
                start: datetime.start,
              },
            });
          },
        });
      });
    }

    if (!recurring) {
      void mutateAsync({
        id: booking.id,
        data: {
          duration,
          start: datetime.start,
        },
      });
    }
  }, [
    booking.end,
    booking.id,
    booking.repetitive,
    booking.start,
    datetimeGetValues,
    mutateAsync,
    t,
  ]);

  return (
    <>
      <ListItem
        disabled={!currentEmployee?.permissions?.bookings}
        icon={<Icon name={icons.UnavailableBooking} />}
        iconAfter={<Icon name="ArrowRight" />}
        label={t(`unavailable_brand_booking.profile.groups.datetime.title`)}
        text={[
          DateHelper.format(booking.start, me?.preferences?.dateFormat),
          isBrandBookingAllDay(booking)
            ? t('shared.schedule.duration.all_day')
            : `${DateHelper.format(booking.start, 'p')} - ${DateHelper.format(booking.end, 'p')}`,
        ]
          .filter(Boolean)
          .join(' · ')}
        onPress={openModal}
      />

      <SlideSheetModal
        scrollable
        headerTitle={t(`unavailable_brand_booking.profile.groups.datetime.title`)}
        visible={modalVisible}
        onClose={closeModal}
      >
        <FormView gap="$5" paddingVertical={defaultPageVerticalPadding}>
          <UnavailableBrandBookingDatetimeController
            disableDrag
            control={datetimeControl}
            onBlur={onUpdate}
          />
        </FormView>
      </SlideSheetModal>
    </>
  );
};

const Note = ({ booking }: { booking: UnavailableBrandBooking }) => {
  const { t } = useTranslation();
  const { value, modalVisible, openModal, closeModal, updateValue } =
    useModalUpdateByIdForm<
      AnyBrandBooking[],
      UpdateBrandBooking,
      Partial<UpdateBrandBooking>
    >({
      id: booking.id,
      query: useUpdateUnavailableBrandBookingReq,
      initialValue: {
        note: booking.note || '',
      },
    });

  const onUpdate = useCallback(
    async (value: Partial<UpdateBrandBooking>) => {
      let recurring = false;

      if (booking.repetitive) {
        recurring = await new Promise((resolve) => {
          ConfirmAlert({
            title: t('unavailable_brand_booking.profile.update_recurring'),
            cancelText: t('shared.no'),
            confirmText: t('shared.yes'),
            onCancel: () => resolve(false),
            onAgree: () => {
              resolve(true);

              void updateValue({
                ...value,
                recurring,
              });
            },
          });
        });
      }

      if (!recurring) {
        void updateValue(value);
      }
    },
    [booking.repetitive, t, updateValue],
  );

  return (
    <>
      <ListItem
        icon={<Icon name="InfoCircle" />}
        iconAfter={<Icon name="ArrowRight" />}
        label={t(`unavailable_brand_booking.profile.groups.note.title`)}
        text={value.note || t('shared.not_specified')}
        onPress={openModal}
      />

      <SlideSheetModal
        scrollable
        headerTitle={t(`unavailable_brand_booking.profile.groups.note.title`)}
        visible={modalVisible}
        onClose={closeModal}
      >
        <FormView gap="$5" paddingVertical={defaultPageVerticalPadding}>
          <SingeElementForm
            name="note"
            value={value.note}
            controllerProps={{
              placeholder: t(`unavailable_brand_booking.form.note.placeholder`)
            }}
            onUpdate={onUpdate}
            Controller={BrandBookingNoteController}
          />
        </FormView>
      </SlideSheetModal>
    </>
  );
};
