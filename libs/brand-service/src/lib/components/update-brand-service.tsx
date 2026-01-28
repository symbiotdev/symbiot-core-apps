import {
  BrandService,
  Currency,
  UpdateBrandService as TUpdateBrandService,
  useBrandServiceFormatsReq,
  useModalUpdateByIdForm,
  useUpdateBrandServiceReq,
} from '@symbiot-core-apps/api';
import {
  defaultPageVerticalPadding,
  FrameView,
  frameViewStyles,
  Icon,
  ListItem,
  ListItemGroup,
  LoadingView,
  PageView,
  SlideSheetModal,
} from '@symbiot-core-apps/ui';
import { useWindowDimensions } from 'react-native';
import React, { useCallback, useMemo } from 'react';
import { ImagePickerAsset } from 'expo-image-picker';
import {
  AvatarPicker,
  SingeElementForm,
  SingleElementToArrayForm,
} from '@symbiot-core-apps/form-controller';
import { BrandServiceNameController } from './controller/brand-service-name-controller';
import { BrandServiceDescriptionController } from './controller/brand-service-description-controller';
import { BrandServiceAvailabilityController } from './controller/brand-service-availability-controller';
import { BrandServiceTypeController } from './controller/brand-service-type-controller';
import { BrandServiceFormatController } from './controller/brand-service-format-controller';
import { BrandServicePlacesController } from './controller/brand-service-places-controller';
import { BrandServiceGenderController } from './controller/brand-service-gender-controller';
import {
  DateHelper,
  formatDiscount,
  formatPrice,
  useI18n,
} from '@symbiot-core-apps/shared';
import { BrandServiceDurationController } from './controller/brand-service-duration-controller';
import { useCurrentBrandState } from '@symbiot-core-apps/state';
import { BrandServiceCurrencyController } from './controller/brand-service-currency-controller';
import { BrandServicePriceController } from './controller/brand-service-price-controller';
import { BrandServiceDiscountController } from './controller/brand-service-discount-controller';
import { BrandServiceNoteController } from './controller/brand-service-note-controller';
import { BrandServiceLocationController } from './controller/brand-service-location-controller';
import { BrandServiceEmployeesController } from './controller/brand-service-employees-controller';
import { useAllBrandLocation } from '@symbiot-core-apps/brand';
import { View } from 'tamagui';
import { useAppSettings } from '@symbiot-core-apps/app';

export const UpdateBrandService = ({ service }: { service: BrandService }) => {
  const { height } = useWindowDimensions();
  const { functionality } = useAppSettings();
  const { mutateAsync: updateAvatar, isPending: avatarUpdating } =
    useUpdateBrandServiceReq();

  const onAddAvatar = useCallback(
    (avatar: ImagePickerAsset) =>
      updateAvatar({
        id: service.id,
        data: {
          avatar,
        },
      }),
    [service.id, updateAvatar],
  );

  return (
    <PageView scrollable withHeaderHeight withKeyboard gap="$5">
      <View>
        <AvatarPicker
          allowsEditing={false}
          marginHorizontal="auto"
          loading={avatarUpdating}
          name={service.name}
          borderRadius="$10"
          color="$background1"
          url={service.avatar?.url}
          size={{
            width: '100%',
            height: Math.max(height / 3, 250),
          }}
          onAttach={onAddAvatar}
        />
      </View>

      <Availability service={service} />

      <ListItemGroup style={frameViewStyles}>
        {functionality.availability.servicePrice && (
          <Pricing service={service} />
        )}

        <About service={service} />
        <Structure service={service} />
        <LocationProviders service={service} />
        <Note service={service} />
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

const EmployeesForm = SingeElementForm<{
  location: string | null;
}>;

const Availability = ({ service }: { service: BrandService }) => {
  const { mutateAsync, isPending } = useUpdateBrandServiceReq();

  const onUpdate = useCallback(
    () =>
      mutateAsync({
        id: service.id,
        data: {
          hidden: !service.hidden,
        },
      }),
    [mutateAsync, service.hidden, service.id],
  );

  return (
    <FrameView>
      <LoadingForm
        name="hidden"
        value={!service.hidden}
        controllerProps={{
          disabled: isPending,
          loading: isPending,
        }}
        onUpdate={onUpdate}
        Controller={BrandServiceAvailabilityController}
      />
    </FrameView>
  );
};

const Pricing = ({ service }: { service: BrandService }) => {
  const { brand } = useCurrentBrandState();
  const { t } = useI18n();
  const { value, modalVisible, openModal, closeModal, updateValue } =
    useModalUpdateByIdForm<
      BrandService,
      {
        currency: string;
        price: number;
        discount: number;
      },
      TUpdateBrandService
    >({
      id: service.id,
      query: useUpdateBrandServiceReq,
      initialValue: {
        currency: service.currency?.value,
        price: service.price,
        discount: service.discount,
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
        label={t('brand_service.update.groups.pricing.title')}
        text={[
          value.price
            ? formatPrice({
                price: service.price,
                symbol: service.currency?.symbol,
              })
            : t('brand_service.free'),
          value.discount
            ? `${t('brand_service.form.discount.label')} ${formatDiscount({
                discount: service.discount,
                symbol: service.currency?.symbol,
              })}`
            : '',
        ]
          .filter(Boolean)
          .join(' · ')}
        onPress={openModal}
      />

      <SlideSheetModal
        scrollable
        headerTitle={t('brand_service.update.groups.pricing.title')}
        visible={modalVisible}
        onClose={closeModal}
      >
        <FrameView gap="$5" paddingVertical={defaultPageVerticalPadding}>
          {brand?.currencies && brand.currencies.length > 1 && (
            <SingeElementForm
              name="currency"
              value={value.currency}
              controllerProps={{
                disableDrag: true,
              }}
              onUpdate={updateValue}
              Controller={BrandServiceCurrencyController}
            />
          )}

          <PriceForm
            name="price"
            value={service.price}
            controllerProps={{
              currency: priceCurrency,
            }}
            onUpdate={updateValue}
            Controller={BrandServicePriceController}
          />

          <DiscountForm
            name="discount"
            value={service.discount}
            controllerProps={{
              currency: priceCurrency,
              max: value.price,
            }}
            onUpdate={updateValue}
            Controller={BrandServiceDiscountController}
          />
        </FrameView>
      </SlideSheetModal>
    </>
  );
};

const LocationProviders = ({ service }: { service: BrandService }) => {
  const { t } = useI18n();
  const allLocations = useAllBrandLocation();
  const { value, modalVisible, openModal, closeModal, updateValue, updating } =
    useModalUpdateByIdForm<
      BrandService,
      TUpdateBrandService,
      TUpdateBrandService
    >({
      id: service.id,
      query: useUpdateBrandServiceReq,
      initialValue: {
        locations: service.locations?.map(({ id }) => id) || [],
      },
    });

  const employees = useMemo(
    () => service.employees.map(({ id }) => id) || [],
    [service.employees],
  );

  return (
    <>
      <ListItem
        icon={<Icon name="MapPoint" />}
        iconAfter={<Icon name="ArrowRight" />}
        label={t('brand_service.update.groups.location_providers.title')}
        text={
          [
            service.locations?.map(({ name }) => name).join(', ') ||
              allLocations.label,
            service.employees?.map(({ name }) => name)?.join(', '),
          ]
            .filter(Boolean)
            .join(' · ') || t('shared.not_specified')
        }
        onPress={openModal}
      />

      <SlideSheetModal
        scrollable
        headerTitle={t('brand_service.update.groups.location_providers.title')}
        visible={modalVisible}
        onClose={closeModal}
      >
        <FrameView gap="$5" paddingVertical={defaultPageVerticalPadding}>
          <SingleElementToArrayForm
            name="locations"
            value={
              value.locations?.length ? value.locations : [allLocations.value]
            }
            controllerProps={{
              disableDrag: true,
            }}
            onUpdate={updateValue}
            Controller={BrandServiceLocationController}
          />

          {!updating ? (
            <EmployeesForm
              name="employees"
              value={employees}
              controllerProps={{
                location: service.locations?.[0]?.id,
              }}
              onUpdate={({ employees }: TUpdateBrandService) =>
                !modalVisible &&
                updateValue({
                  employees,
                })
              }
              Controller={BrandServiceEmployeesController}
            />
          ) : (
            <LoadingView />
          )}
        </FrameView>
      </SlideSheetModal>
    </>
  );
};

const About = ({ service }: { service: BrandService }) => {
  const { t } = useI18n();
  const { value, modalVisible, openModal, closeModal, updateValue } =
    useModalUpdateByIdForm<
      BrandService,
      {
        name: string;
        description: string;
      },
      TUpdateBrandService
    >({
      id: service.id,
      query: useUpdateBrandServiceReq,
      initialValue: {
        name: service.name,
        description: service.description,
      },
    });

  return (
    <>
      <ListItem
        icon={<Icon name="InfoCircle" />}
        iconAfter={<Icon name="ArrowRight" />}
        label={t('brand_service.update.groups.about.title')}
        text={[value.name, value.description?.replace(/\n/gi, ' ')]
          .filter(Boolean)
          .join(' · ')}
        onPress={openModal}
      />

      <SlideSheetModal
        scrollable
        headerTitle={t('brand_service.update.groups.about.title')}
        visible={modalVisible}
        onClose={closeModal}
      >
        <FrameView gap="$5" paddingVertical={defaultPageVerticalPadding}>
          <SingeElementForm
            name="name"
            value={value.name}
            onUpdate={updateValue}
            Controller={BrandServiceNameController}
          />
          <SingeElementForm
            name="description"
            value={value.description}
            onUpdate={updateValue}
            Controller={BrandServiceDescriptionController}
          />
        </FrameView>
      </SlideSheetModal>
    </>
  );
};

const Structure = ({ service }: { service: BrandService }) => {
  const { t } = useI18n();
  const { data: formats } = useBrandServiceFormatsReq();
  const { value, modalVisible, openModal, closeModal, updateValue } =
    useModalUpdateByIdForm<
      BrandService,
      {
        type: string;
        format: string;
        places: number;
        duration: number;
        gender: string;
      },
      TUpdateBrandService
    >({
      id: service.id,
      query: useUpdateBrandServiceReq,
      initialValue: {
        type: service.type?.value,
        format: service.format?.value,
        places: service.places,
        duration: service.duration,
        gender: service.gender?.value,
      },
    });

  return (
    <>
      <ListItem
        icon={<Icon name="Tuning2" />}
        iconAfter={<Icon name="ArrowRight" />}
        label={t('brand_service.update.groups.structure.title')}
        text={[
          `${t('brand_service.form.duration.label')} (${DateHelper.formatDuration(value.duration)})`,
          service.type?.label,
          service.format
            ? `${service.format.label}${!service.format.fixed ? ` (${service.places})` : ''}`
            : '',
          service.gender?.value ? service.gender.label : '',
        ]
          .filter(Boolean)
          .join(' · ')}
        onPress={openModal}
      />

      <SlideSheetModal
        scrollable
        headerTitle={t('brand_service.update.groups.structure.title')}
        visible={modalVisible}
        onClose={closeModal}
      >
        <FrameView gap="$5" paddingVertical={defaultPageVerticalPadding}>
          <SingeElementForm
            name="type"
            value={value.type}
            controllerProps={{
              disableDrag: true,
            }}
            onUpdate={updateValue}
            Controller={BrandServiceTypeController}
          />
          <SingeElementForm
            name="format"
            value={value.format}
            controllerProps={{
              disableDrag: true,
            }}
            onUpdate={updateValue}
            Controller={BrandServiceFormatController}
          />
          {formats?.find((format) => format.value === value.format)?.fixed ===
            false && (
            <SingeElementForm
              name="places"
              value={value.places}
              onUpdate={updateValue}
              Controller={BrandServicePlacesController}
            />
          )}
          <SingeElementForm
            name="duration"
            value={value.duration}
            controllerProps={{
              disableDrag: true,
            }}
            onUpdate={updateValue}
            Controller={BrandServiceDurationController}
          />
          <SingeElementForm
            name="gender"
            value={value.gender}
            controllerProps={{
              disableDrag: true,
            }}
            onUpdate={updateValue}
            Controller={BrandServiceGenderController}
          />
        </FrameView>
      </SlideSheetModal>
    </>
  );
};

const Note = ({ service }: { service: BrandService }) => {
  const { t } = useI18n();
  const { value, modalVisible, openModal, closeModal, updateValue } =
    useModalUpdateByIdForm<
      BrandService,
      {
        note: string;
      },
      TUpdateBrandService
    >({
      id: service.id,
      query: useUpdateBrandServiceReq,
      initialValue: {
        note: service.note,
      },
    });

  return (
    <>
      <ListItem
        icon={<Icon name="ChatRoundDots" />}
        iconAfter={<Icon name="ArrowRight" />}
        label={t('brand_service.update.groups.note.title')}
        text={
          value.note?.replace(/\n/gi, ' ')?.trim() || t('shared.not_specified')
        }
        onPress={openModal}
      />

      <SlideSheetModal
        scrollable
        headerTitle={t('brand_service.update.groups.note.title')}
        visible={modalVisible}
        onClose={closeModal}
      >
        <FrameView gap="$5" paddingVertical={defaultPageVerticalPadding}>
          <SingeElementForm
            name="note"
            value={value.note}
            onUpdate={updateValue}
            Controller={BrandServiceNoteController}
          />
        </FrameView>
      </SlideSheetModal>
    </>
  );
};
