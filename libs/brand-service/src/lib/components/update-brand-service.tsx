import {
  BrandService,
  Currency,
  UpdateBrandService as TUpdateBrandService,
  useBrandServiceFormatsQuery,
  useModalUpdateByIdForm,
  useUpdateBrandServiceQuery,
} from '@symbiot-core-apps/api';
import {
  AvatarPicker,
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
import { useWindowDimensions } from 'react-native';
import React, { useCallback, useMemo } from 'react';
import { ImagePickerAsset } from 'expo-image-picker';
import { useTranslation } from 'react-i18next';
import {
  ArrayForm,
  SingeElementForm,
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
} from '@symbiot-core-apps/shared';
import { BrandServiceDurationController } from './controller/brand-service-duration-controller';
import { BrandServiceRemindersController } from './controller/brand-service-reminders-controller';
import { useCurrentBrandState } from '@symbiot-core-apps/state';
import { BrandServiceCurrencyController } from './controller/brand-service-currency-controller';
import { BrandServicePriceController } from './controller/brand-service-price-controller';
import { BrandServiceDiscountController } from './controller/brand-service-discount-controller';
import { BrandServiceNoteController } from './controller/brand-service-note-controller';
import { BrandServiceLocationController } from './controller/brand-service-location-controller';
import { BrandServiceEmployeesController } from './controller/brand-service-employees-controller';

export const UpdateBrandService = ({ service }: { service: BrandService }) => {
  const { height } = useWindowDimensions();
  const { mutateAsync: updateAvatar, isPending: avatarUpdating } =
    useUpdateBrandServiceQuery();

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
      <AvatarPicker
        allowsEditing={false}
        marginHorizontal="auto"
        loading={avatarUpdating}
        name={service.name}
        borderRadius="$10"
        color="$background1"
        url={service.avatarUrl}
        size={{
          width: '100%',
          height: Math.max(height / 3, 250),
        }}
        onAttach={onAddAvatar}
      />

      <Availability service={service} />

      <ListItemGroup style={formViewStyles}>
        <Pricing service={service} />
        <LocationProviders service={service} />
        <About service={service} />
        <Structure service={service} />
        <Scheduling service={service} />
        <Note service={service} />
      </ListItemGroup>
    </PageView>
  );
};

const LoadingForm = SingeElementForm<{
  disabled: boolean;
  loading: boolean;
}>;

const Availability = ({ service }: { service: BrandService }) => {
  const { mutateAsync, isPending } = useUpdateBrandServiceQuery();

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
    <FormView>
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
    </FormView>
  );
};

const PriceForm = SingeElementForm<{
  currency?: Currency;
}>;

const DiscountForm = SingeElementForm<{
  currency?: Currency;
  max: number;
}>;

const Pricing = ({ service }: { service: BrandService }) => {
  const { brand } = useCurrentBrandState();
  const { t } = useTranslation();
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
      query: useUpdateBrandServiceQuery,
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
        <FormView gap="$5" paddingVertical={defaultPageVerticalPadding}>
          {brand?.currencies && brand.currencies.length > 1 && (
            <SingeElementForm
              name="currency"
              value={value.currency}
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
        </FormView>
      </SlideSheetModal>
    </>
  );
};

const EmployeesForm = SingeElementForm<{
  location: string | null;
}>;

const LocationProviders = ({ service }: { service: BrandService }) => {
  const { t } = useTranslation();
  const { value, modalVisible, openModal, closeModal, updateValue, updating } =
    useModalUpdateByIdForm<
      BrandService,
      TUpdateBrandService,
      TUpdateBrandService
    >({
      id: service.id,
      query: useUpdateBrandServiceQuery,
      initialValue: {
        location: service.location?.id || null,
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
            service.location?.name,
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
        <FormView gap="$5" paddingVertical={defaultPageVerticalPadding}>
          <SingeElementForm
            name="location"
            value={value.location}
            onUpdate={updateValue}
            Controller={BrandServiceLocationController}
          />
          {!updating ? (
            <EmployeesForm
              name="employees"
              value={employees}
              onUpdate={updateValue}
              controllerProps={{
                location: service.location?.id || null,
              }}
              Controller={BrandServiceEmployeesController}
            />
          ) : (
            <LoadingView />
          )}
        </FormView>
      </SlideSheetModal>
    </>
  );
};

const About = ({ service }: { service: BrandService }) => {
  const { t } = useTranslation();
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
      query: useUpdateBrandServiceQuery,
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
        <FormView gap="$5" paddingVertical={defaultPageVerticalPadding}>
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
        </FormView>
      </SlideSheetModal>
    </>
  );
};

const Structure = ({ service }: { service: BrandService }) => {
  const { t } = useTranslation();
  const { data: formats } = useBrandServiceFormatsQuery();
  const { value, modalVisible, openModal, closeModal, updateValue } =
    useModalUpdateByIdForm<
      BrandService,
      {
        type: string;
        format: string;
        places: number;
        gender: string;
      },
      TUpdateBrandService
    >({
      id: service.id,
      query: useUpdateBrandServiceQuery,
      initialValue: {
        type: service.type?.value,
        format: service.format?.value,
        places: service.places,
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
        <FormView gap="$5" paddingVertical={defaultPageVerticalPadding}>
          <SingeElementForm
            name="type"
            value={value.type}
            onUpdate={updateValue}
            Controller={BrandServiceTypeController}
          />
          <SingeElementForm
            name="format"
            value={value.format}
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
            name="gender"
            value={value.gender}
            onUpdate={updateValue}
            Controller={BrandServiceGenderController}
          />
        </FormView>
      </SlideSheetModal>
    </>
  );
};

const Scheduling = ({ service }: { service: BrandService }) => {
  const { t } = useTranslation();
  const { value, modalVisible, openModal, closeModal, updateValue } =
    useModalUpdateByIdForm<
      BrandService,
      {
        duration: number;
        reminders: number[];
      },
      TUpdateBrandService
    >({
      id: service.id,
      query: useUpdateBrandServiceQuery,
      initialValue: {
        duration: service.duration,
        reminders: service.reminders,
      },
    });

  return (
    <>
      <ListItem
        icon={<Icon name="Calendar" />}
        iconAfter={<Icon name="ArrowRight" />}
        label={t('brand_service.update.groups.scheduling.title')}
        text={[
          `${t('brand_service.form.duration.label')} (${DateHelper.formatDuration(service.duration)})`,
          value.reminders?.length
            ? `${t('brand_service.form.reminders.label')} (${t(
                'shared.datetime.time_before',
                {
                  value: value.reminders
                    .sort((a, b) => a - b)
                    .map((minutes) => DateHelper.formatDuration(minutes))
                    .join(', '),
                },
              )})`
            : '',
        ]
          .filter(Boolean)
          .join(' · ')}
        onPress={openModal}
      />

      <SlideSheetModal
        scrollable
        headerTitle={t('brand_service.update.groups.scheduling.title')}
        visible={modalVisible}
        onClose={closeModal}
      >
        <FormView gap="$5" paddingVertical={defaultPageVerticalPadding}>
          <SingeElementForm
            name="duration"
            value={value.duration}
            onUpdate={updateValue}
            Controller={BrandServiceDurationController}
          />
          <ArrayForm
            name="reminders"
            value={value.reminders}
            onUpdate={updateValue}
            Controller={BrandServiceRemindersController}
          />
        </FormView>
      </SlideSheetModal>
    </>
  );
};

const Note = ({ service }: { service: BrandService }) => {
  const { t } = useTranslation();
  const { value, modalVisible, openModal, closeModal, updateValue } =
    useModalUpdateByIdForm<
      BrandService,
      {
        note: string;
      },
      TUpdateBrandService
    >({
      id: service.id,
      query: useUpdateBrandServiceQuery,
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
        text={value.note?.replace(/\n/gi, ' ') || t('shared.not_specified')}
        onPress={openModal}
      />

      <SlideSheetModal
        scrollable
        headerTitle={t('brand_service.update.groups.note.title')}
        visible={modalVisible}
        onClose={closeModal}
      >
        <FormView gap="$5" paddingVertical={defaultPageVerticalPadding}>
          <SingeElementForm
            name="note"
            value={value.note}
            onUpdate={updateValue}
            Controller={BrandServiceNoteController}
          />
        </FormView>
      </SlideSheetModal>
    </>
  );
};
