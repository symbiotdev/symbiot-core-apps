import {
  BrandTicket,
  Currency,
  UpdateBrandTicket as TUpdateBrandTicket,
  useModalUpdateByIdForm,
  useUpdateBrandTicketQuery,
} from '@symbiot-core-apps/api';
import {
  defaultPageVerticalPadding,
  FormView,
  formViewStyles,
  Icon,
  ListItem,
  ListItemGroup,
  LoadingView,
  PageView,
  SlideSheetModal,
} from '@symbiot-core-apps/ui';
import React, { useCallback, useMemo } from 'react';
import {
  SingeElementForm,
  SingleElementToArrayForm,
} from '@symbiot-core-apps/form-controller';
import { BrandTicketAvailabilityController } from './controller/brand-ticket-availability-controller';
import { useCurrentBrandState } from '@symbiot-core-apps/state';
import { useTranslation } from 'react-i18next';
import { formatDiscount, formatPrice } from '@symbiot-core-apps/shared';
import { BrandTicketCurrencyController } from './controller/brand-ticket-currency-controller';
import { BrandTicketPriceController } from './controller/brand-ticket-price-controller';
import { BrandTicketDiscountController } from './controller/brand-ticket-discount-controller';
import { BrandTicketNameController } from './controller/brand-ticket-name-controller';
import { BrandTicketDescriptionController } from './controller/brand-ticket-description-controller';
import { BrandTicketNoteController } from './controller/brand-ticket-note-controller';
import { BrandTicketLocationController } from './controller/brand-ticket-location-controller';
import { BrandTicketServicesController } from './controller/brand-ticket-services-controller';
import { useAllBrandLocation } from '@symbiot-core-apps/brand';
import { BrandTicketVisitsController } from './controller/brand-ticket-visits-controller';

export const UpdateBrandTicket = ({ ticket }: { ticket: BrandTicket }) => {
  return (
    <PageView scrollable withHeaderHeight withKeyboard gap="$5">
      <Availability ticket={ticket} />

      <ListItemGroup style={formViewStyles}>
        <PricingAndVisits ticket={ticket} />
        <About ticket={ticket} />
        <LocationServices ticket={ticket} />
        <Note ticket={ticket} />
      </ListItemGroup>
    </PageView>
  );
};

const LoadingForm = SingeElementForm<{
  disabled: boolean;
  loading: boolean;
}>;

const PriceForm = SingeElementForm<{
  currency?: Currency;
}>;

const DiscountForm = SingeElementForm<{
  currency?: Currency;
  max: number;
}>;

const ServicesForm = SingeElementForm<{
  location: string | null;
}>;

const Availability = ({ ticket }: { ticket: BrandTicket }) => {
  const { mutateAsync, isPending } = useUpdateBrandTicketQuery();

  const onUpdate = useCallback(
    () =>
      mutateAsync({
        id: ticket.id,
        data: {
          hidden: !ticket.hidden,
        },
      }),
    [mutateAsync, ticket.hidden, ticket.id],
  );

  return (
    <FormView>
      <LoadingForm
        name="hidden"
        value={!ticket.hidden}
        controllerProps={{
          disabled: isPending,
          loading: isPending,
        }}
        onUpdate={onUpdate}
        Controller={BrandTicketAvailabilityController}
      />
    </FormView>
  );
};

const PricingAndVisits = ({ ticket }: { ticket: BrandTicket }) => {
  const { brand } = useCurrentBrandState();
  const { t } = useTranslation();
  const { value, modalVisible, openModal, closeModal, updateValue } =
    useModalUpdateByIdForm<
      BrandTicket,
      {
        currency: string;
        price: number;
        discount: number;
        visits: number;
      },
      TUpdateBrandTicket
    >({
      id: ticket.id,
      query: useUpdateBrandTicketQuery,
      initialValue: {
        currency: ticket.currency?.value,
        price: ticket.price,
        discount: ticket.discount,
        visits: ticket.visits,
      },
    });

  const priceCurrency = value.currency
    ? brand?.currencies?.find((currency) => currency.value === value.currency)
    : brand?.currencies?.[0];

  return (
    <>
      <ListItem
        icon={<Icon name="MoneyBag" />}
        iconAfter={<Icon name="ArrowRight" />}
        label={t('brand_ticket.update.groups.pricing_visits.title')}
        text={[
          value.price
            ? formatPrice({
                price: ticket.price,
                symbol: ticket.currency?.symbol,
              })
            : t('brand_ticket.free'),
          value.discount
            ? `${t('brand_ticket.form.discount.label')} ${formatDiscount({
                discount: ticket.discount,
                symbol: ticket.currency?.symbol,
              })}`
            : '',
          ticket.visits,
        ]
          .filter(Boolean)
          .join(' · ')}
        onPress={openModal}
      />

      <SlideSheetModal
        scrollable
        headerTitle={t('brand_ticket.update.groups.pricing_visits.title')}
        visible={modalVisible}
        onClose={closeModal}
      >
        <FormView gap="$5" paddingVertical={defaultPageVerticalPadding}>
          {brand?.currencies && brand.currencies.length > 1 && (
            <SingeElementForm
              name="currency"
              value={value.currency}
              onUpdate={updateValue}
              Controller={BrandTicketCurrencyController}
            />
          )}

          <PriceForm
            name="price"
            value={ticket.price}
            controllerProps={{
              currency: priceCurrency,
            }}
            onUpdate={updateValue}
            Controller={BrandTicketPriceController}
          />

          <DiscountForm
            name="discount"
            value={ticket.discount}
            controllerProps={{
              currency: priceCurrency,
              max: value.price,
            }}
            onUpdate={updateValue}
            Controller={BrandTicketDiscountController}
          />

          <SingeElementForm
            name="visits"
            value={value.visits}
            controllerProps={{
              disableDrag: true
            }}
            onUpdate={updateValue}
            Controller={BrandTicketVisitsController}
          />
        </FormView>
      </SlideSheetModal>
    </>
  );
};

const LocationServices = ({ ticket }: { ticket: BrandTicket }) => {
  const { t } = useTranslation();
  const allLocations = useAllBrandLocation();
  const { value, modalVisible, openModal, closeModal, updateValue, updating } =
    useModalUpdateByIdForm<BrandTicket, TUpdateBrandTicket, TUpdateBrandTicket>(
      {
        id: ticket.id,
        query: useUpdateBrandTicketQuery,
        initialValue: {
          locations: ticket.locations?.map(({ id }) => id) || [],
        },
      },
    );

  const services = useMemo(
    () => ticket.services?.map(({ id }) => id) || [],
    [ticket.services],
  );

  return (
    <>
      <ListItem
        icon={<Icon name="MapPoint" />}
        iconAfter={<Icon name="ArrowRight" />}
        label={t('brand_ticket.update.groups.location_services.title')}
        text={
          [
            ticket.locations?.map(({ name }) => name).join(', ') ||
              allLocations.label,
            ticket.services?.map(({ name }) => name)?.join(', '),
          ]
            .filter(Boolean)
            .join(' · ') || t('shared.not_specified')
        }
        onPress={openModal}
      />
      <SlideSheetModal
        scrollable
        headerTitle={t('brand_ticket.update.groups.location_services.title')}
        visible={modalVisible}
        onClose={closeModal}
      >
        <FormView gap="$5" paddingVertical={defaultPageVerticalPadding}>
          <SingleElementToArrayForm
            name="locations"
            value={
              value.locations?.length ? value.locations : [allLocations.value]
            }
            controllerProps={{
              disableDrag: true
            }}
            onUpdate={updateValue}
            Controller={BrandTicketLocationController}
          />

          {!updating ? (
            <ServicesForm
              name="services"
              value={services}
              controllerProps={{
                location: ticket.locations?.[0]?.id,
              }}
              onUpdate={({ services }: TUpdateBrandTicket) =>
                !modalVisible &&
                updateValue({
                  services,
                })
              }
              Controller={BrandTicketServicesController}
            />
          ) : (
            <LoadingView />
          )}
        </FormView>
      </SlideSheetModal>
    </>
  );
};

const About = ({ ticket }: { ticket: BrandTicket }) => {
  const { t } = useTranslation();
  const { value, modalVisible, openModal, closeModal, updateValue } =
    useModalUpdateByIdForm<
      BrandTicket,
      {
        name: string;
        description: string;
      },
      TUpdateBrandTicket
    >({
      id: ticket.id,
      query: useUpdateBrandTicketQuery,
      initialValue: {
        name: ticket.name,
        description: ticket.description,
      },
    });

  return (
    <>
      <ListItem
        icon={<Icon name="InfoCircle" />}
        iconAfter={<Icon name="ArrowRight" />}
        label={t('brand_ticket.update.groups.about.title')}
        text={[value.name, value.description?.replace(/\n/gi, ' ')]
          .filter(Boolean)
          .join(' · ')}
        onPress={openModal}
      />

      <SlideSheetModal
        scrollable
        headerTitle={t('brand_ticket.update.groups.about.title')}
        visible={modalVisible}
        onClose={closeModal}
      >
        <FormView gap="$5" paddingVertical={defaultPageVerticalPadding}>
          <SingeElementForm
            name="name"
            value={value.name}
            onUpdate={updateValue}
            Controller={BrandTicketNameController}
          />
          <SingeElementForm
            name="description"
            value={value.description}
            onUpdate={updateValue}
            Controller={BrandTicketDescriptionController}
          />
        </FormView>
      </SlideSheetModal>
    </>
  );
};

const Note = ({ ticket }: { ticket: BrandTicket }) => {
  const { t } = useTranslation();
  const { value, modalVisible, openModal, closeModal, updateValue } =
    useModalUpdateByIdForm<
      BrandTicket,
      {
        note: string;
      },
      TUpdateBrandTicket
    >({
      id: ticket.id,
      query: useUpdateBrandTicketQuery,
      initialValue: {
        note: ticket.note,
      },
    });

  return (
    <>
      <ListItem
        icon={<Icon name="ChatRoundDots" />}
        iconAfter={<Icon name="ArrowRight" />}
        label={t('brand_ticket.update.groups.note.title')}
        text={value.note?.replace(/\n/gi, ' ') || t('shared.not_specified')}
        onPress={openModal}
      />

      <SlideSheetModal
        scrollable
        headerTitle={t('brand_ticket.update.groups.note.title')}
        visible={modalVisible}
        onClose={closeModal}
      >
        <FormView gap="$5" paddingVertical={defaultPageVerticalPadding}>
          <SingeElementForm
            name="note"
            value={value.note}
            onUpdate={updateValue}
            Controller={BrandTicketNoteController}
          />
        </FormView>
      </SlideSheetModal>
    </>
  );
};
