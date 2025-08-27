import {
  BrandLocation,
  useUpdateBrandLocationQuery,
} from '@symbiot-core-apps/api';
import {
  defaultPageVerticalPadding,
  FormView,
  Icon,
  ListItem,
  SlideSheetModal,
  WeekdaySchedule,
  WeekdaysSchedule,
} from '@symbiot-core-apps/ui';
import {
  arraysOfObjectsEqual,
  DateHelper,
  isTablet,
} from '@symbiot-core-apps/shared';
import { useCurrentAccount } from '@symbiot-core-apps/state';
import { useBrandLocationForm } from '../hooks/use-brand-location-form';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const BrandLocationScheduleForm = ({
  location,
}: {
  location: BrandLocation;
}) => {
  const { t } = useTranslation();
  const { me } = useCurrentAccount();
  const { mutateAsync: update } = useUpdateBrandLocationQuery();
  const form = useBrandLocationForm();

  const [modalVisible, setModalVisible] = useState(false);
  const [value, setValue] = useState(location.schedules);

  const text = useMemo(() => {
    const date = DateHelper.startOfDay(new Date());
    const weekdays = DateHelper.getWeekdays({
      weekStartsOn: me?.preferences?.weekStartsOn,
      formatStr: 'eee',
    });

    return weekdays
      .map((weekday) => {
        const targetSchedule = value.find(({ day }) => day === weekday.value);

        if (!targetSchedule) return '';

        const dayValue =
          !targetSchedule.start && !targetSchedule.end
            ? `- ${t('shared.schedule.day_off')}`
            : `${DateHelper.format(
                DateHelper.set(date, {
                  minutes: targetSchedule.start,
                }),
                'p',
              )} - ${DateHelper.format(
                DateHelper.set(date, {
                  minutes: targetSchedule.end,
                }),
                'p',
              )}`;

        return `${weekday.label} ${dayValue}`;
      })
      .join(' · ');
  }, [me?.preferences?.weekStartsOn, t, value]);

  const openModal = useCallback(() => setModalVisible(true), []);
  const closeModal = useCallback(async () => {
    setModalVisible(false);

    if (!arraysOfObjectsEqual(location.schedules, value)) {
      try {
        await update({
          id: location.id,
          data: { schedules: value },
        });
      } catch {
        setValue(location.schedules);

        setTimeout(openModal, 500);
      }
    }
  }, [location.id, location.schedules, openModal, update, value]);

  return (
    <>
      <ListItem
        icon={<Icon name="Calendar" />}
        iconAfter={<Icon name="ArrowRight" />}
        label={form.schedules.title}
        text={text}
        onPress={openModal}
      />

      <SlideSheetModal
        scrollable
        headerTitle={form.schedules.title}
        visible={modalVisible}
        onClose={closeModal}
      >
        <FormView paddingVertical={defaultPageVerticalPadding}>
          <WeekdaysSchedule
            disableDrag={!isTablet}
            value={value as WeekdaySchedule[]}
            weekStartsOn={me?.preferences?.weekStartsOn}
            onChange={setValue}
          />
        </FormView>
      </SlideSheetModal>
    </>
  );
};
