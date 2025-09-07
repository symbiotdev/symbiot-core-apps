import {
  BrandEmployee,
  useCurrentBrandLocationsQuery,
} from '@symbiot-core-apps/api';
import { useBrandEmployeeForm } from '../hooks/use-brand-employee-form';
import { useCallback, useEffect, useMemo } from 'react';
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
        schedules: employee.schedules,
      },
      dataRequestFormatted: (value) => {
        return {
          locations: value.location ? [value.location] : [],
          schedules:
            value.schedules?.map((schedule) => ({
              ...schedule,
              location: value.location,
            })) || [],
        };
      },
    });

  return (
    <>
      <ListItem
        icon={<Icon name="MapPoint" />}
        iconAfter={<Icon name="ArrowRight" />}
        label={form.location.title}
        text={[
          employee.locations?.map(({ name }) => name).join(' · ') ||
            dynamicLocation.label,
          employee.schedules?.length
            ? employee.locations?.length
              ? form.locationCustomSchedule.description
              : form.employeeSchedule.description
            : '',
        ]
          .filter(Boolean)
          .join(' · ')}
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
    defaultValues: { location, schedules },
    resolver: yupResolver(
      yup
        .object()
        .shape({
          location: form.location.scheme,
          schedules: form.schedules.scheme,
        })
        .required(),
    ),
  });

  const watchValue = watch();

  const onChangeSchedule = useCallback(() => {
    setValue(
      'schedules',
      watchValue.schedules.length ? [] : form.schedules.defaultValue,
    );
  }, [form.schedules.defaultValue, setValue, watchValue.schedules.length]);

  useEffect(() => {
    setValue('location', location);
  }, [setValue, location]);

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
            onChange={(newValue) => {
              onChange(newValue);
              setValue('schedules', []);
            }}
          />
        )}
      />

      <Card>
        <Switch
          label={
            watchValue.location
              ? form.locationCustomSchedule.label
              : form.employeeSchedule.label
          }
          description={
            watchValue.location
              ? form.locationCustomSchedule.description
              : form.employeeSchedule.description
          }
          checked={!!watchValue.schedules.length}
          onChange={onChangeSchedule}
        />
      </Card>

      {!!watchValue.schedules.length && (
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
