import {
  BrandService,
  UpdateBrandService,
  useModalUpdateByIdForm,
  useUpdateBrandServiceQuery,
} from '@symbiot-core-apps/api';
import {
  defaultPageHorizontalPadding,
  defaultPageVerticalPadding,
  DurationPicker,
  FormView,
  Icon,
  ListItem,
  SlideSheetModal,
  ToggleGroup,
  ToggleOnChange,
} from '@symbiot-core-apps/ui';
import { DateHelper } from '@symbiot-core-apps/shared';
import { useBrandServiceForm } from '../hooks/use-brand-service-form';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';

type FormValue = {
  duration: number;
  reminders: number[];
};

export const BrandServiceSchedulingForm = ({
  service,
}: {
  service: BrandService;
}) => {
  const form = useBrandServiceForm();
  const { value, modalVisible, openModal, closeModal, updateValue } =
    useModalUpdateByIdForm<BrandService, FormValue, UpdateBrandService>({
      id: service.id,
      query: useUpdateBrandServiceQuery,
      initialValue: {
        duration: service.duration,
        reminders: service.reminders || [],
      },
    });

  return (
    <>
      <ListItem
        icon={<Icon name="Calendar" />}
        iconAfter={<Icon name="ArrowRight" />}
        label={form.scheduling.title}
        text={[
          `${form.duration.label} - ${DateHelper.formatDuration(service.duration)}`,
          value.reminders?.length
            ? `${form.reminders.label} - ${form.reminders.options
                .filter((reminder) => value.reminders.includes(reminder.value))
                .map((reminder) => reminder.label)
                .join(', ')}`
            : '',
        ]
          .filter(Boolean)
          .join(' · ')}
        onPress={openModal}
      />

      <SlideSheetModal
        scrollable
        headerTitle={form.scheduling.title}
        visible={modalVisible}
        onClose={closeModal}
      >
        <Form {...value} onUpdateValue={updateValue} />
      </SlideSheetModal>
    </>
  );
};

const Form = ({
  duration,
  reminders,
  onUpdateValue,
}: FormValue & {
  onUpdateValue: (value: Partial<FormValue>) => unknown;
}) => {
  const form = useBrandServiceForm();

  const selectedRemindersRef = useRef(reminders);

  const [selectedReminders, setSelectedReminders] = useState(reminders);

  const {
    control: durationControl,
    handleSubmit: durationHandleSubmit,
    setValue: setDurationValue,
  } = useForm<{
    duration: number;
  }>({
    defaultValues: { duration },
    resolver: yupResolver(
      yup
        .object()
        .shape({
          duration: form.duration.scheme,
        })
        .required(),
    ),
  });

  const updateReminders = useCallback((newReminders: number[]) => {
    setSelectedReminders(newReminders);
    selectedRemindersRef.current = newReminders;
  }, []);

  useLayoutEffect(() => {
    setDurationValue('duration', duration);
  }, [duration, setDurationValue]);

  useLayoutEffect(() => {
    setSelectedReminders(reminders);
    selectedRemindersRef.current = reminders;

    return () => {
      onUpdateValue({ reminders: selectedRemindersRef.current });
    };
  }, [onUpdateValue, reminders]);

  return (
    <FormView gap="$5" paddingVertical={defaultPageVerticalPadding}>
      <Controller
        control={durationControl}
        name="duration"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <DurationPicker
            value={value}
            error={error?.message}
            label={form.duration.label}
            placeholder={form.duration.placeholder}
            units={['hours', 'minutes']}
            onChange={(duration) => {
              onChange(duration);
              durationHandleSubmit(onUpdateValue)();
            }}
          />
        )}
      />

      <ToggleGroup
        allowEmpty
        multiselect
        viewProps={{
          backgroundColor: '$background1',
          borderRadius: '$10',
          paddingHorizontal: defaultPageHorizontalPadding,
        }}
        label={form.reminders.label}
        items={form.reminders.options}
        value={selectedReminders}
        onChange={updateReminders as ToggleOnChange}
      />
    </FormView>
  );
};
