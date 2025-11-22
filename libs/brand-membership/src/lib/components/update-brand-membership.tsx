import {
  AnyBrandMembership,
  BrandMembership,
  BrandMembershipType,
  BrandPeriodBasedMembership,
  BrandVisitBasedMembership,
  Currency,
  getBrandMembershipType,
  getTranslateKeyByBrandMembership,
  UpdateBrandMembership as TUpdateBrandMembership,
  useModalUpdateByIdForm,
  useUpdateBrandMembershipReq,
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
import { BrandMembershipVisitsController } from './controller/brand-membership-visits-controller';

export const UpdateBrandMembership = ({
  membership,
}: {
  membership: AnyBrandMembership;
}) => {
  return (
    <PageView scrollable withHeaderHeight withKeyboard gap="$5">
      <Availability membership={membership} />

      <FormView>
        {getBrandMembershipType(membership) === BrandMembershipType.period && (
          <Period membership={membership as BrandPeriodBasedMembership} />
        )}
        {getBrandMembershipType(membership) === BrandMembershipType.visits && (
          <Visits membership={membership as BrandVisitBasedMembership} />
        )}
      </FormView>

      <ListItemGroup style={formViewStyles}>
        <About membership={membership} />
        <Pricing membership={membership} />
        <LocationServices membership={membership} />
        <Note membership={membership} />
      </ListItemGroup>
    </PageView>
  );
};

const LoadingForm = SingeElementForm<{
  type: BrandMembershipType;
  disabled: boolean;
  loading: boolean;
}>;

const PriceForm = SingeElementForm<{
  type: BrandMembershipType;
  currency?: Currency;
}>;

const DiscountForm = SingeElementForm<{
  type: BrandMembershipType;
  currency?: Currency;
  max: number;
}>;

const ServicesForm = SingeElementForm<{
  type: BrandMembershipType;
  location: string | null;
}>;

const Availability = ({ membership }: { membership: BrandMembership }) => {
  const { mutateAsync, isPending } = useUpdateBrandMembershipReq();

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
          type: getBrandMembershipType(membership),
          disabled: isPending,
          loading: isPending,
        }}
        onUpdate={onUpdate}
        Controller={BrandMembershipAvailabilityController}
      />
    </FormView>
  );
};

const Period = ({ membership }: { membership: BrandPeriodBasedMembership }) => {
  const { value, updateValue } = useModalUpdateByIdForm<
    BrandMembership,
    {
      period: string;
    },
    TUpdateBrandMembership
  >({
    id: membership.id,
    query: useUpdateBrandMembershipReq,
    initialValue: {
      period: membership.period?.value,
    },
  });

  return (
    <SingeElementForm
      name="period"
      value={value.period}
      controllerProps={{
        type: getBrandMembershipType(membership),
      }}
      onUpdate={updateValue}
      Controller={BrandMembershipPeriodController}
    />
  );
};

const Visits = ({ membership }: { membership: BrandVisitBasedMembership }) => {
  const { value, updateValue } = useModalUpdateByIdForm<
    BrandMembership,
    {
      visits: number;
    },
    TUpdateBrandMembership
  >({
    id: membership.id,
    query: useUpdateBrandMembershipReq,
    initialValue: {
      visits: membership.visits,
    },
  });

  return (
    <SingeElementForm
      name="visits"
      value={value.visits}
      controllerProps={{
        type: getBrandMembershipType(membership),
      }}
      onUpdate={updateValue}
      Controller={BrandMembershipVisitsController}
    />
  );
};

const Pricing = ({ membership }: { membership: BrandMembership }) => {
  const { brand } = useCurrentBrandState();
  const { t } = useTranslation();
  const type = getBrandMembershipType(membership);
  const tPrefix = getTranslateKeyByBrandMembership(membership);
  const { value, modalVisible, openModal, closeModal, updateValue } =
    useModalUpdateByIdForm<
      BrandMembership,
      {
        currency: string;
        price: number;
        discount: number;
      },
      TUpdateBrandMembership
    >({
      id: membership.id,
      query: useUpdateBrandMembershipReq,
      initialValue: {
        currency: membership.currency?.value,
        price: membership.price,
        discount: membership.discount,
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
        label={t(`${tPrefix}.update.groups.pricing.title`)}
        text={[
          value.price
            ? formatPrice({
                price: membership.price,
                symbol: membership.currency?.symbol,
              })
            : t('shared.free'),
          value.discount
            ? `${t(`${tPrefix}.form.discount.label`)} ${formatDiscount({
                discount: membership.discount,
                symbol: membership.currency?.symbol,
              })}`
            : '',
        ]
          .filter(Boolean)
          .join(' · ')}
        onPress={openModal}
      />

      <SlideSheetModal
        scrollable
        headerTitle={t(`${tPrefix}.update.groups.pricing.title`)}
        visible={modalVisible}
        onClose={closeModal}
      >
        <FormView gap="$5" paddingVertical={defaultPageVerticalPadding}>
          {brand?.currencies && brand.currencies.length > 1 && (
            <SingeElementForm
              name="currency"
              value={value.currency}
              controllerProps={{
                type,
              }}
              onUpdate={updateValue}
              Controller={BrandMembershipCurrencyController}
            />
          )}

          <PriceForm
            name="price"
            value={membership.price}
            controllerProps={{
              type,
              currency: priceCurrency,
            }}
            onUpdate={updateValue}
            Controller={BrandMembershipPriceController}
          />

          <DiscountForm
            name="discount"
            value={membership.discount}
            controllerProps={{
              type,
              currency: priceCurrency,
              max: value.price,
            }}
            onUpdate={updateValue}
            Controller={BrandMembershipDiscountController}
          />
        </FormView>
      </SlideSheetModal>
    </>
  );
};

const LocationServices = ({ membership }: { membership: BrandMembership }) => {
  const { t } = useTranslation();
  const tPrefix = getTranslateKeyByBrandMembership(membership);
  const type = getBrandMembershipType(membership);
  const allLocations = useAllBrandLocation();
  const { value, modalVisible, openModal, closeModal, updateValue, updating } =
    useModalUpdateByIdForm<
      BrandMembership,
      TUpdateBrandMembership,
      TUpdateBrandMembership
    >({
      id: membership.id,
      query: useUpdateBrandMembershipReq,
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
        label={t(`${tPrefix}.update.groups.location_services.title`)}
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
        headerTitle={t(`${tPrefix}.update.groups.location_services.title`)}
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
              type,
              disableDrag: true,
            }}
            onUpdate={updateValue}
            Controller={BrandMembershipLocationController}
          />

          {!updating ? (
            <ServicesForm
              name="services"
              value={services}
              controllerProps={{
                type,
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
  const tPrefix = getTranslateKeyByBrandMembership(membership);
  const type = getBrandMembershipType(membership);
  const { value, modalVisible, openModal, closeModal, updateValue } =
    useModalUpdateByIdForm<
      BrandMembership,
      {
        name: string;
        description: string;
      },
      TUpdateBrandMembership
    >({
      id: membership.id,
      query: useUpdateBrandMembershipReq,
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
        label={t(`${tPrefix}.update.groups.about.title`)}
        text={[value.name, value.description?.replace(/\n/gi, ' ')]
          .filter(Boolean)
          .join(' · ')}
        onPress={openModal}
      />

      <SlideSheetModal
        scrollable
        headerTitle={t(`${tPrefix}.update.groups.about.title`)}
        visible={modalVisible}
        onClose={closeModal}
      >
        <FormView gap="$5" paddingVertical={defaultPageVerticalPadding}>
          <SingeElementForm
            name="name"
            value={value.name}
            controllerProps={{
              type,
            }}
            onUpdate={updateValue}
            Controller={BrandMembershipNameController}
          />
          <SingeElementForm
            name="description"
            value={value.description}
            controllerProps={{
              type,
            }}
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
  const tPrefix = getTranslateKeyByBrandMembership(membership);

  const { value, modalVisible, openModal, closeModal, updateValue } =
    useModalUpdateByIdForm<
      BrandMembership,
      {
        note: string;
      },
      TUpdateBrandMembership
    >({
      id: membership.id,
      query: useUpdateBrandMembershipReq,
      initialValue: {
        note: membership.note,
      },
    });

  return (
    <>
      <ListItem
        icon={<Icon name="ChatRoundDots" />}
        iconAfter={<Icon name="ArrowRight" />}
        label={t(`${tPrefix}.update.groups.note.title`)}
        text={value.note?.replace(/\n/gi, ' ')?.trim() || t('shared.not_specified')}
        onPress={openModal}
      />

      <SlideSheetModal
        scrollable
        headerTitle={t(`${tPrefix}.update.groups.note.title`)}
        visible={modalVisible}
        onClose={closeModal}
      >
        <FormView gap="$5" paddingVertical={defaultPageVerticalPadding}>
          <SingeElementForm
            name="note"
            value={value.note}
            controllerProps={{
              noLabel: true,
              type: getBrandMembershipType(membership),
            }}
            onUpdate={updateValue}
            Controller={BrandMembershipNoteController}
          />
        </FormView>
      </SlideSheetModal>
    </>
  );
};
