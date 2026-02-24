import { Control, Controller } from 'react-hook-form';
import { BrandService, useServicesReq } from '@symbiot-core-apps/api';
import { useEffect, useMemo } from 'react';
import { ButtonIcon } from '@symbiot-core-apps/ui';
import { BrandServiceItem } from '@symbiot-core-apps/brand';
import { XStack } from 'tamagui';
import { useI18n } from '@symbiot-core-apps/shared';
import {
  PickerOnChange,
  Select,
  Textarea,
} from '@symbiot-core-apps/form-controller';

export function BrandBookingServicesController(props: {
  control: Control<{ details: { service: string; note: string } }>;
  required?: boolean;
  disabled?: boolean;
}) {
  const { t } = useI18n();
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
  noLabel,
  onChange,
}: {
  value?: string;
  services?: BrandService[];
  servicesLoading?: boolean;
  servicesError?: string | null;
  disabled?: boolean;
  noLabel?: boolean;
  onChange: PickerOnChange;
}) => {
  const { t } = useI18n();

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
    <Select
      required
      searchable
      value={value}
      label={!noLabel ? t('service_brand_booking.form.service.label') : ''}
      optionsLabel={t('service_brand_booking.form.service.label')}
      placeholder={t('service_brand_booking.form.service.placeholder')}
      disabled={disabled}
      options={items}
      optionsLoading={servicesLoading}
      optionsError={servicesError}
      trigger={
        selectedService ? (
          <XStack
            gap="$2"
            padding="$4"
            borderRadius="$10"
            alignItems="center"
            backgroundColor="$background1"
          >
            <BrandServiceItem
              hidePricing
              flexShrink={1}
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
