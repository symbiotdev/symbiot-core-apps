import { Control, Controller } from 'react-hook-form';
import { BrandService, useServicesReq } from '@symbiot-core-apps/api';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ButtonIcon,
  PickerOnChange,
  SelectPicker,
  Textarea,
} from '@symbiot-core-apps/ui';
import { BrandServiceItem } from '@symbiot-core-apps/brand';
import { XStack } from 'tamagui';

export function BrandBookingServicesController(props: {
  control: Control<{ details: { service: string; note: string } }>;
  required?: boolean;
  disabled?: boolean;
  disableDrag?: boolean;
}) {
  const { t } = useTranslation();
  const { items, isPending, error } = useServicesReq({
    params: {
      take: 999,
    },
  });

  return (
    <Controller
      name="details"
      control={props.control}
      rules={{
        validate: (value) =>
          value.service
            ? true
            : t('service_brand_booking.form.service.error.required'),
      }}
      render={({ field: { value, onChange } }) => (
        <>
          <SelectService
            value={value.service}
            disabled={props.disabled}
            disableDrag={props.disableDrag}
            services={items}
            servicesLoading={isPending}
            servicesError={error}
            onChange={(service) =>
              onChange({
                ...value,
                service,
                note: items?.find(({ id }) => id === service)?.note,
              })
            }
          />

          <Textarea
            countCharacters
            enterKeyHint="done"
            value={value.note}
            label={t(`service_brand_booking.form.note.label`)}
            placeholder={t(`service_brand_booking.form.note.placeholder`)}
            onChange={(note) =>
              onChange({
                ...value,
                note,
              })
            }
          />
        </>
      )}
    />
  );
}

const SelectService = ({
  value,
  services,
  servicesLoading,
  servicesError,
  disabled,
  disableDrag,
  noLabel,
  onChange,
}: {
  value?: string;
  services?: BrandService[];
  servicesLoading?: boolean;
  servicesError?: string | null;
  disabled?: boolean;
  noLabel?: boolean;
  disableDrag?: boolean;
  onChange: PickerOnChange;
}) => {
  const { t } = useTranslation();

  const items = useMemo(
    () =>
      services?.map((service) => ({
        label: service.name,
        value: service.id,
      })),
    [services],
  );

  const selectedService = useMemo(
    () => services?.find((service) => service.id === value),
    [services, value],
  );

  useEffect(() => {
    if (
      items?.length &&
      (!value || !items.some((item) => item.value === value))
    ) {
      onChange(items[0].value);
    }
  }, [items, onChange, value]);

  return (
    <SelectPicker
      required
      value={value}
      label={!noLabel ? t('service_brand_booking.form.service.label') : ''}
      placeholder={t('service_brand_booking.form.service.placeholder')}
      disabled={disabled}
      disableDrag={disableDrag}
      options={items}
      optionsLoading={servicesLoading}
      optionsError={servicesError}
      trigger={
        selectedService ? (
          <XStack alignItems="center" gap="$2" flex={1}>
            <BrandServiceItem
              hidePricing
              flex={1}
              backgroundColor="$background1"
              borderRadius="$10"
              padding="$4"
              service={selectedService}
            />
            <ButtonIcon iconName="Pen" type="clear" />
          </XStack>
        ) : undefined
      }
      onChange={onChange}
    />
  );
};
