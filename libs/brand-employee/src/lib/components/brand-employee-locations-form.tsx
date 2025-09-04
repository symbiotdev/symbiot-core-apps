import {
  BrandEmployee,
  useCurrentBrandLocationsQuery,
} from '@symbiot-core-apps/api';
import { useBrandEmployeeForm } from '../hooks/use-brand-employee-form';
import { useEffect, useMemo } from 'react';
import {
  Card,
  defaultPageVerticalPadding,
  FormView,
  Icon,
  ListItem,
  SelectPicker,
  SlideSheetModal,
  Switch,
  WeekdaySchedule,
  WeekdaysSchedule,
} from '@symbiot-core-apps/ui';
import { useDynamicBrandLocation } from '@symbiot-core-apps/brand-location';
import { useUpdateBrandEmployeeForm } from '../hooks/use-update-brand-employee-form';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { isTablet } from '@symbiot-core-apps/shared';
import { useCurrentAccount } from '@symbiot-core-apps/state';

type FormValue = {
  location: string | null;
  customSchedule: boolean;
  schedules: WeekdaySchedule[];
};

export const BrandEmployeeLocationsForm = ({
  employee,
}: {
  employee: BrandEmployee;
}) => {
  const dynamicLocation = useDynamicBrandLocation();
  const form = useBrandEmployeeForm();
  const { value, modalVisible, openModal, closeModal, updateValue } =
    useUpdateBrandEmployeeForm<FormValue>({
      id: employee.id,
      initialValue: {
        location:
          employee.locations?.[0]?.id || (dynamicLocation.value as null),
        customSchedule:
          !employee.locations.length || !!employee.schedules.length,
        schedules: employee.schedules?.length
          ? employee.schedules
          : form.schedule.defaultValue,
      },
      dataRequestFormatted: (value) => {
        return {
          locations: value.location ? [value.location] : [],
          schedules:
            value.customSchedule || !value.location
              ? value.schedules?.map((schedule) => ({
                  ...schedule,
                  location: value.location,
                }))
              : [],
        };
      },
    });

  return (
    <>
      <ListItem
        icon={<Icon name="MapPoint" />}
        iconAfter={<Icon name="ArrowRight" />}
        label={form.location.title}
        text={
          employee.locations?.map(({ name }) => name).join(' · ') ||
          dynamicLocation.label
        }
        onPress={openModal}
      />

      <SlideSheetModal
        scrollable
        headerTitle={form.location.title}
        visible={modalVisible}
        onClose={closeModal}
      >
        <Form {...value} onUpdateValue={updateValue} />
      </SlideSheetModal>
    </>
  );
};

const Form = ({
  location,
  customSchedule,
  schedules,
  onUpdateValue,
}: FormValue & {
  onUpdateValue: (value: Partial<FormValue>) => unknown;
}) => {
  const { me } = useCurrentAccount();
  const form = useBrandEmployeeForm();

  const {
    data: locations,
    isPending: locationsLoading,
    error: locationsError,
  } = useCurrentBrandLocationsQuery();
  const dynamicLocation = useDynamicBrandLocation();

  const locationsAsOptions = useMemo(
    () =>
      locations?.items && [
        dynamicLocation,
        ...locations.items.map((location) => ({
          label: location.name,
          description: location.address,
          value: location.id,
        })),
      ],
    [dynamicLocation, locations],
  );

  const { control, handleSubmit, setValue, watch } = useForm<FormValue>({
    defaultValues: { location, customSchedule, schedules },
    resolver: yupResolver(
      yup
        .object()
        .shape({
          location: form.location.scheme,
          customSchedule: form.customSchedule.scheme,
          schedules: form.schedule.scheme,
        })
        .required(),
    ),
  });

  const watchValue = watch();

  useEffect(() => {
    setValue('location', location);
  }, [setValue, location]);

  useEffect(() => {
    setValue('customSchedule', customSchedule);
  }, [setValue, customSchedule]);

  useEffect(() => {
    setValue('schedules', schedules);
  }, [setValue, schedules]);

  useEffect(() => {
    return () => {
      handleSubmit(onUpdateValue)();
    };
  }, [handleSubmit, onUpdateValue]);

  return (
    <FormView gap="$5" paddingVertical={defaultPageVerticalPadding}>
      <Controller
        control={control}
        name="location"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <SelectPicker
            label={form.location.label}
            sheetLabel={form.location.label}
            placeholder={form.location.placeholder}
            options={locationsAsOptions}
            optionsLoading={locationsLoading}
            optionsError={locationsError}
            value={value}
            error={error?.message}
            onChange={onChange}
          />
        )}
      />

      {watchValue.location && (
        <Controller
          control={control}
          name="customSchedule"
          render={({ field: { value, onChange } }) => (
            <Card>
              <Switch
                label={form.customSchedule.label}
                checked={value}
                onChange={onChange}
              />
            </Card>
          )}
        />
      )}

      {(watchValue.customSchedule || !watchValue.location) && (
        <Controller
          control={control}
          name="schedules"
          render={({ field: { value, onChange } }) => (
            <WeekdaysSchedule
              disableDrag={!isTablet}
              value={value as WeekdaySchedule[]}
              weekStartsOn={me?.preferences?.weekStartsOn}
              onChange={onChange}
            />
          )}
        />
      )}
    </FormView>
  );
};
