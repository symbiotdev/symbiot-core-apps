import { Control, Controller } from 'react-hook-form';
import { BrandBookingSlot, BrandEmployee } from '@symbiot-core-apps/api';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AnimatedList,
  Avatar,
  Button,
  DatePicker,
  EmptyView,
  HorizontalPicker,
  HorizontalPickerOnChange,
  Icon,
  InitView,
  PickerItem,
  PickerOnChange,
  SelectPicker,
} from '@symbiot-core-apps/ui';
import {
  arraysOfObjectsEqual,
  DateHelper,
  shortName,
} from '@symbiot-core-apps/shared';
import { useCurrentAccountState } from '@symbiot-core-apps/state';
import { useApp } from '@symbiot-core-apps/app';

type ScheduleControl = Control<{
  schedule: {
    date: Date;
    location?: string;
    employee?: string;
    start?: number;
    providers: BrandEmployee[];
  };
}>;

export function ServiceBrandBookingScheduleController({
  slots,
  slotsLoading,
  slotsError,
  control,
  disabled,
  disableDrag,
}: {
  control: ScheduleControl;
  slots?: BrandBookingSlot[];
  slotsLoading?: boolean;
  slotsError?: string | null;
  disabled?: boolean;
  disableDrag?: boolean;
}) {
  const { t } = useTranslation();
  const { me } = useCurrentAccountState();

  return (
    <Controller
      name="schedule"
      control={control}
      rules={{
        validate: (value) => value.start !== undefined,
      }}
      render={({ field: { value, onChange } }) => {
        return (
          <>
            <DatePicker
              required
              disabled={disabled}
              disableDrag={disableDrag}
              value={value.date}
              formatStr={me?.preferences?.dateFormat}
              weekStartsOn={me?.preferences?.weekStartsOn}
              minDate={new Date()}
              maxDate={DateHelper.addYears(new Date(), 100)}
              label={t('service_brand_booking.form.date.label')}
              placeholder={t('service_brand_booking.form.date.placeholder')}
              onChange={(date) =>
                onChange({
                  ...value,
                  date,
                })
              }
            />

            {!slots ? (
              <InitView loading={slotsLoading} error={slotsError} />
            ) : (
              <>
                <Locations
                  data={slots}
                  value={value.location}
                  onChange={(location) =>
                    onChange({
                      ...value,
                      location,
                    })
                  }
                />

                <Providers
                  data={slots}
                  value={value.employee}
                  locationId={value.location}
                  onSelectEmployee={(employee) =>
                    onChange({
                      ...value,
                      employee,
                    })
                  }
                  onLoadProviders={(providers) =>
                    !arraysOfObjectsEqual(providers, value.providers) &&
                    onChange({
                      ...value,
                      providers,
                    })
                  }
                />

                <Controller
                  name="schedule.start"
                  control={control}
                  rules={{
                    validate: (value) =>
                      !isNaN(Number(value))
                        ? true
                        : t('service_brand_booking.form.slots.error.required'),
                  }}
                  render={() => (
                    <TimeSlots
                      data={slots}
                      value={value.start}
                      employeeId={value.employee}
                      locationId={value.location}
                      onSelect={(start) =>
                        onChange({
                          ...value,
                          start,
                        })
                      }
                    />
                  )}
                />
              </>
            )}
          </>
        );
      }}
    />
  );
}

const Locations = ({
  data,
  value,
  disableDrag,
  onChange,
}: {
  value?: string;
  disableDrag?: boolean;
  data: BrandBookingSlot[];
  onChange: PickerOnChange;
}) => {
  const { t } = useTranslation();

  const locations = useMemo(
    () =>
      data
        ?.flatMap(
          ({ location }) =>
            location && {
              label: location.name,
              value: location.id,
            },
        )
        ?.filter(Boolean) as PickerItem[],
    [data],
  );

  const canSelectLocation = useMemo(
    () => locations && locations.length > 1,
    [locations],
  );

  useEffect(() => {
    if (
      locations &&
      !locations?.some((location) => location.value === value) &&
      locations[0]?.value !== value
    ) {
      onChange(locations[0]?.value);
    }
  }, [locations, value, onChange]);

  return (
    canSelectLocation && (
      <SelectPicker
        required
        disableDrag={disableDrag}
        label={t('service_brand_booking.form.location.label')}
        placeholder={t('service_brand_booking.form.location.placeholder')}
        value={value}
        options={locations}
        onChange={onChange as PickerOnChange}
      />
    )
  );
};

const Providers = ({
  data,
  locationId,
  value,
  onSelectEmployee,
  onLoadProviders,
}: {
  value?: string;
  locationId?: string;
  data: BrandBookingSlot[];
  onSelectEmployee: HorizontalPickerOnChange;
  onLoadProviders: (providers: BrandEmployee[]) => void;
}) => {
  const { t } = useTranslation();

  const providers = useMemo(
    () =>
      data?.flatMap(({ providers, location }) =>
        location?.id === locationId ? providers : [],
      ),
    [data, locationId],
  );

  const items = useMemo(
    () =>
      providers?.map(({ id, name, avatar, avatarColor }) => ({
        value: id,
        label: shortName(name, 'trim-lastname'),
        icon: (
          <Avatar
            name={name}
            size={30}
            url={avatar?.xsUrl}
            color={avatarColor}
          />
        ),
      })),
    [providers],
  );

  useEffect(() => {
    if (providers) {
      onLoadProviders(providers);

      if (!providers.some(({ id }) => id === value)) {
        const nextValue = providers.length > 1 ? undefined : providers[0]?.id;

        if (nextValue !== value) {
          onSelectEmployee(nextValue);
        }
      }
    }
  }, [onSelectEmployee, onLoadProviders, providers, value]);

  return (
    !!providers?.length && (
      <HorizontalPicker
        value={value}
        items={items}
        noValueItem={
          providers.length > 1
            ? {
                label: t('service_brand_booking.form.provider.any_label'),
                value: undefined,
                icon: <Icon name="UsersGroupRounded" size={30} />,
              }
            : undefined
        }
        label={t('service_brand_booking.form.provider.label')}
        onChange={onSelectEmployee}
      />
    )
  );
};

const TimeSlots = ({
  value,
  data,
  employeeId,
  locationId,
  onSelect,
}: {
  value?: number;
  employeeId?: string;
  locationId?: string;
  data: BrandBookingSlot[];
  onSelect: (minutes: number | undefined) => void;
}) => {
  const { icons } = useApp();
  const { t } = useTranslation();

  const slots = useMemo(() => {
    const minutes = Array.from(
      new Set(
        data.flatMap((item) =>
          item.location?.id === locationId
            ? employeeId
              ? item.slots[employeeId]
              : Object.values(item.slots).flat()
            : [],
        ),
      ),
    ).filter(Boolean);

    if (!minutes.length) {
      return [];
    }

    const startOfDate = DateHelper.startOfDay(new Date());

    return minutes
      .sort((a, b) => a - b)
      .map((value) => ({
        value,
        label: DateHelper.format(
          DateHelper.addMinutes(startOfDate, value),
          'p',
        ),
      }));
  }, [data, employeeId, locationId]);

  useEffect(() => {
    if (value && !slots.some((slot) => slot.value === value)) {
      onSelect(undefined);
    }
  }, [onSelect, slots, value]);

  return (
    <AnimatedList
      numColumns={2}
      scrollEnabled={false}
      data={slots}
      keyExtractor={({ value }) => String(value)}
      contentContainerStyle={{
        gap: 4,
        maxWidth: 400,
        width: '100%',
        marginHorizontal: 'auto',
      }}
      columnWrapperStyle={{
        gap: 4,
      }}
      ListEmptyComponent={() => (
        <EmptyView
          iconName={icons.ServiceBooking}
          message={t('service_brand_booking.form.slots.empty')}
        />
      )}
      renderItem={({ item }) => (
        <Button
          flex={1}
          key={item.value}
          type={value === item.value ? 'default' : 'outlined'}
          label={item.label}
          onPress={() => onSelect(item.value)}
        />
      )}
    />
  );
};
