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
  UpdateUnavailableBrandBooking,
  useModalUpdateByIdForm,
  useUpdateUnavailableBrandBookingReq,
} from '@symbiot-core-apps/api';
import { BrandBookingItem, BrandEmployeeItem } from '@symbiot-core-apps/brand';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import React, { useCallback } from 'react';
import { ConfirmAlert, DateHelper, useModal } from '@symbiot-core-apps/shared';
import { useCurrentAccountState } from '@symbiot-core-apps/state';
import { useApp } from '@symbiot-core-apps/app';
import { SingeElementForm } from '@symbiot-core-apps/form-controller';
import { UnavailableBrandBookingReasonController } from './controller/unavailable-brand-booking-reason-controller';
import { useForm } from 'react-hook-form';
import { UnavailableBrandBookingDatetimeController } from './controller/unavailable-brand-booking-datetime-controller';

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

          <Reason booking={booking} />
        </ListItemGroup>
      </FormView>
    </PageView>
  );
};

const DateTime = ({ booking }: { booking: UnavailableBrandBooking }) => {
  const { t } = useTranslation();
  const { me } = useCurrentAccountState();
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

  const onUpdate = useCallback(() => {
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
      ConfirmAlert({
        title: t('unavailable_brand_booking.profile.update_recurring'),
        cancelText: t('shared.no'),
        confirmText: t('shared.yes'),
        callback: async () => {
          recurring = true;

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
        headerTitle={t(`unavailable_brand_booking.profile.groups.reason.title`)}
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

const Reason = ({ booking }: { booking: UnavailableBrandBooking }) => {
  const { t } = useTranslation();
  const { value, modalVisible, openModal, closeModal, updateValue } =
    useModalUpdateByIdForm<
      AnyBrandBooking[],
      UpdateUnavailableBrandBooking,
      Partial<UpdateUnavailableBrandBooking>
    >({
      id: booking.id,
      query: useUpdateUnavailableBrandBookingReq,
      initialValue: {
        reason: booking.reason || '',
      },
    });

  const onUpdate = useCallback(
    async (value: Partial<UpdateUnavailableBrandBooking>) => {
      let recurring = false;

      if (booking.repetitive) {
        ConfirmAlert({
          title: t('unavailable_brand_booking.profile.update_recurring'),
          cancelText: t('shared.no'),
          confirmText: t('shared.yes'),
          callback: () => {
            recurring = true;

            void updateValue({
              ...value,
              recurring,
            });
          },
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
        label={t(`unavailable_brand_booking.profile.groups.reason.title`)}
        text={value.reason || t('shared.not_specified')}
        onPress={openModal}
      />

      <SlideSheetModal
        scrollable
        headerTitle={t(`unavailable_brand_booking.profile.groups.reason.title`)}
        visible={modalVisible}
        onClose={closeModal}
      >
        <FormView gap="$5" paddingVertical={defaultPageVerticalPadding}>
          <SingeElementForm
            name="reason"
            value={value.reason}
            onUpdate={onUpdate}
            Controller={UnavailableBrandBookingReasonController}
          />
        </FormView>
      </SlideSheetModal>
    </>
  );
};
