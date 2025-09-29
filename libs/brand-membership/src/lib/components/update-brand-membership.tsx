import {
  BrandMembership,
  Currency,
  UpdateBrandMembership as TUpdateBrandMembership,
  UpdateBrandService as TUpdateBrandService,
  useModalUpdateByIdForm,
  useUpdateBrandMembershipQuery,
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
import { BrandMembershipAvailabilityController } from './controller/brand-membership-availability-controller';
import { useCurrentBrandState } from '@symbiot-core-apps/state';
import { useTranslation } from 'react-i18next';
import { formatDiscount, formatPrice } from '@symbiot-core-apps/shared';
import { BrandMembershipCurrencyController } from './controller/brand-membership-currency-controller';
import { BrandMembershipPriceController } from './controller/brand-membership-price-controller';
import { BrandMembershipDiscountController } from './controller/brand-membership-discount-controller';
import { BrandMembershipPeriodController } from './controller/brand-membership-period-controller';
import { BrandMembershipNameController } from './controller/brand-membership-name-controller';
import { BrandMembershipDescriptionController } from './controller/brand-membership-description-controller';
import { BrandMembershipNoteController } from './controller/brand-membership-note-controller';
import { BrandMembershipLocationController } from './controller/brand-membership-location-controller';
import { BrandMembershipServicesController } from './controller/brand-membership-services-controller';
import { useAllBrandLocation } from '@symbiot-core-apps/brand';

export const UpdateBrandMembership = ({
  membership,
}: {
  membership: BrandMembership;
}) => {
  return (
    <PageView scrollable withHeaderHeight withKeyboard gap="$5">
      <Availability membership={membership} />

      <ListItemGroup style={formViewStyles}>
        <PricingAndPeriod membership={membership} />
        <About membership={membership} />
        <LocationServices membership={membership} />
        <Note membership={membership} />
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

const Availability = ({ membership }: { membership: BrandMembership }) => {
  const { mutateAsync, isPending } = useUpdateBrandMembershipQuery();

  const onUpdate = useCallback(
    () =>
      mutateAsync({
        id: membership.id,
        data: {
          hidden: !membership.hidden,
        },
      }),
    [mutateAsync, membership.hidden, membership.id],
  );

  return (
    <FormView>
      <LoadingForm
        name="hidden"
        value={!membership.hidden}
        controllerProps={{
          disabled: isPending,
          loading: isPending,
        }}
        onUpdate={onUpdate}
        Controller={BrandMembershipAvailabilityController}
      />
    </FormView>
  );
};

const PricingAndPeriod = ({ membership }: { membership: BrandMembership }) => {
  const { brand } = useCurrentBrandState();
  const { t } = useTranslation();
  const { value, modalVisible, openModal, closeModal, updateValue } =
    useModalUpdateByIdForm<
      BrandMembership,
      {
        currency: string;
        price: number;
        discount: number;
        period: string;
      },
      TUpdateBrandMembership
    >({
      id: membership.id,
      query: useUpdateBrandMembershipQuery,
      initialValue: {
        currency: membership.currency?.value,
        price: membership.price,
        discount: membership.discount,
        period: membership.period?.value,
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
        label={t('brand_membership.update.groups.pricing_period.title')}
        text={[
          value.price
            ? formatPrice({
                price: membership.price,
                symbol: membership.currency?.symbol,
              })
            : t('brand_membership.free'),
          value.discount
            ? `${t('brand_membership.form.discount.label')} ${formatDiscount({
                discount: membership.discount,
                symbol: membership.currency?.symbol,
              })}`
            : '',
          membership.period?.label,
        ]
          .filter(Boolean)
          .join(' · ')}
        onPress={openModal}
      />

      <SlideSheetModal
        scrollable
        headerTitle={t('brand_membership.update.groups.pricing_period.title')}
        visible={modalVisible}
        onClose={closeModal}
      >
        <FormView gap="$5" paddingVertical={defaultPageVerticalPadding}>
          {brand?.currencies && brand.currencies.length > 1 && (
            <SingeElementForm
              name="currency"
              value={value.currency}
              onUpdate={updateValue}
              Controller={BrandMembershipCurrencyController}
            />
          )}

          <PriceForm
            name="price"
            value={membership.price}
            controllerProps={{
              currency: priceCurrency,
            }}
            onUpdate={updateValue}
            Controller={BrandMembershipPriceController}
          />

          <DiscountForm
            name="discount"
            value={membership.discount}
            controllerProps={{
              currency: priceCurrency,
              max: value.price,
            }}
            onUpdate={updateValue}
            Controller={BrandMembershipDiscountController}
          />

          <SingeElementForm
            name="period"
            value={value.period}
            onUpdate={updateValue}
            Controller={BrandMembershipPeriodController}
          />
        </FormView>
      </SlideSheetModal>
    </>
  );
};

const LocationServices = ({ membership }: { membership: BrandMembership }) => {
  const { t } = useTranslation();
  const allLocations = useAllBrandLocation();
  const { value, modalVisible, openModal, closeModal, updateValue, updating } =
    useModalUpdateByIdForm<
      BrandMembership,
      TUpdateBrandMembership,
      TUpdateBrandMembership
    >({
      id: membership.id,
      query: useUpdateBrandMembershipQuery,
      initialValue: {
        locations: membership.locations?.map(({ id }) => id) || [],
      },
    });

  const services = useMemo(
    () => membership.services?.map(({ id }) => id) || [],
    [membership.services],
  );

  return (
    <>
      <ListItem
        icon={<Icon name="MapPoint" />}
        iconAfter={<Icon name="ArrowRight" />}
        label={t('brand_membership.update.groups.location_services.title')}
        text={
          [
            membership.locations?.map(({ name }) => name).join(', ') ||
              allLocations.label,
            membership.services?.map(({ name }) => name)?.join(', '),
          ]
            .filter(Boolean)
            .join(' · ') || t('shared.not_specified')
        }
        onPress={openModal}
      />
      <SlideSheetModal
        scrollable
        headerTitle={t(
          'brand_membership.update.groups.location_services.title',
        )}
        visible={modalVisible}
        onClose={closeModal}
      >
        <FormView gap="$5" paddingVertical={defaultPageVerticalPadding}>
          <SingleElementToArrayForm
            name="locations"
            value={
              value.locations?.length ? value.locations : [allLocations.value]
            }
            onUpdate={updateValue}
            Controller={BrandMembershipLocationController}
          />

          {!updating ? (
            <ServicesForm
              name="services"
              value={services}
              controllerProps={{
                location: membership.locations?.[0]?.id,
              }}
              onUpdate={({ services }: TUpdateBrandMembership) =>
                !modalVisible &&
                updateValue({
                  services,
                })
              }
              Controller={BrandMembershipServicesController}
            />
          ) : (
            <LoadingView />
          )}
        </FormView>
      </SlideSheetModal>
    </>
  );
};

const About = ({ membership }: { membership: BrandMembership }) => {
  const { t } = useTranslation();
  const { value, modalVisible, openModal, closeModal, updateValue } =
    useModalUpdateByIdForm<
      BrandMembership,
      {
        name: string;
        description: string;
      },
      TUpdateBrandService
    >({
      id: membership.id,
      query: useUpdateBrandMembershipQuery,
      initialValue: {
        name: membership.name,
        description: membership.description,
      },
    });

  return (
    <>
      <ListItem
        icon={<Icon name="InfoCircle" />}
        iconAfter={<Icon name="ArrowRight" />}
        label={t('brand_membership.update.groups.about.title')}
        text={[value.name, value.description?.replace(/\n/gi, ' ')]
          .filter(Boolean)
          .join(' · ')}
        onPress={openModal}
      />

      <SlideSheetModal
        scrollable
        headerTitle={t('brand_membership.update.groups.about.title')}
        visible={modalVisible}
        onClose={closeModal}
      >
        <FormView gap="$5" paddingVertical={defaultPageVerticalPadding}>
          <SingeElementForm
            name="name"
            value={value.name}
            onUpdate={updateValue}
            Controller={BrandMembershipNameController}
          />
          <SingeElementForm
            name="description"
            value={value.description}
            onUpdate={updateValue}
            Controller={BrandMembershipDescriptionController}
          />
        </FormView>
      </SlideSheetModal>
    </>
  );
};

const Note = ({ membership }: { membership: BrandMembership }) => {
  const { t } = useTranslation();
  const { value, modalVisible, openModal, closeModal, updateValue } =
    useModalUpdateByIdForm<
      BrandMembership,
      {
        note: string;
      },
      TUpdateBrandMembership
    >({
      id: membership.id,
      query: useUpdateBrandMembershipQuery,
      initialValue: {
        note: membership.note,
      },
    });

  return (
    <>
      <ListItem
        icon={<Icon name="ChatRoundDots" />}
        iconAfter={<Icon name="ArrowRight" />}
        label={t('brand_membership.update.groups.note.title')}
        text={value.note?.replace(/\n/gi, ' ') || t('shared.not_specified')}
        onPress={openModal}
      />

      <SlideSheetModal
        scrollable
        headerTitle={t('brand_membership.update.groups.note.title')}
        visible={modalVisible}
        onClose={closeModal}
      >
        <FormView gap="$5" paddingVertical={defaultPageVerticalPadding}>
          <SingeElementForm
            name="note"
            value={value.note}
            onUpdate={updateValue}
            Controller={BrandMembershipNoteController}
          />
        </FormView>
      </SlideSheetModal>
    </>
  );
};
