import {
  BrandLocation,
  Schedule as TSchedule,
  UpdateBrandLocation as TUpdateBrandLocation,
  useModalUpdateByIdForm,
  useUpdateBrandLocationQuery,
} from '@symbiot-core-apps/api';
import {
  defaultPageHorizontalPadding,
  defaultPageVerticalPadding,
  FormView,
  getNicknameFromUrl,
  Icon,
  ListItem,
  ListItemGroup,
  PageView,
  SlideSheetModal,
} from '@symbiot-core-apps/ui';
import { BrandLocationMediaForm } from './form/brand-location-media-form';
import { useTranslation } from 'react-i18next';
import { useCallback, useMemo } from 'react';
import { DateHelper } from '@symbiot-core-apps/shared';
import {
  useCurrentAccount,
  useCurrentBrandState,
} from '@symbiot-core-apps/state';
import { BrandLocationCountryForm } from './form/brand-location-country-form';
import { BrandLocationTimezoneForm } from './form/brand-location-timezone-form';
import { PhoneNumber } from 'react-native-phone-input/dist';
import {
  ArrayForm,
  SingleStringArrayForm,
  StringForm,
} from '@symbiot-core-apps/form-controller';
import { BrandLocationAddressController } from './controller/brand-location-address-controller';
import { BrandLocationCurrencyController } from './controller/brand-location-currency-controller';
import { BrandLocationEmailController } from './controller/brand-location-email-controller';
import { BrandLocationEntranceController } from './controller/brand-location-entrance-controller';
import { BrandLocationFloorController } from './controller/brand-location-floor-controller';
import { BrandLocationInstagramController } from './controller/brand-location-instagram-controller';
import { BrandLocationNameController } from './controller/brand-location-name-controller';
import { BrandLocationPhoneController } from './controller/brand-location-phone-controller';
import { BrandLocationRemarkController } from './controller/brand-location-remark-controller';
import { BrandLocationScheduleController } from './controller/brand-location-schedule-controller';
import { BrandLocationAdvantagesForm } from './form/brand-location-advantages-form';

export const UpdateBrandLocation = ({
  location,
}: {
  location: BrandLocation;
}) => {
  return (
    <PageView
      scrollable
      withHeaderHeight
      withKeyboard
      gap="$5"
      paddingHorizontal={0}
    >
      <BrandLocationMediaForm marginTop="$5" location={location} />

      <FormView paddingHorizontal={defaultPageHorizontalPadding}>
        <Name location={location} />

        <ListItemGroup>
          <Address location={location} />
          <Schedule location={location} />
          <Locale location={location} />
          <Advantages location={location} />
          <Contact location={location} />
        </ListItemGroup>
      </FormView>
    </PageView>
  );
};

const Name = ({ location }: { location: BrandLocation }) => {
  const { mutateAsync } = useUpdateBrandLocationQuery();

  const updateValue = useCallback(
    (data: TUpdateBrandLocation) =>
      mutateAsync({
        id: location.id,
        data,
      }),
    [location.id, mutateAsync],
  );

  return (
    <StringForm
      name="name"
      value={location.name}
      onUpdate={updateValue}
      Controller={BrandLocationNameController}
    />
  );
};

const Address = ({ location }: { location: BrandLocation }) => {
  const { t } = useTranslation();
  const { value, modalVisible, openModal, closeModal, updateValue } =
    useModalUpdateByIdForm<
      BrandLocation,
      { address: string; floor: string; entrance: string; remark: string },
      TUpdateBrandLocation
    >({
      id: location.id,
      query: useUpdateBrandLocationQuery,
      initialValue: {
        address: location.address,
        floor: location.floor,
        entrance: location.entrance,
        remark: location.remark,
      },
    });

  return (
    <>
      <ListItem
        icon={<Icon name="MapPoint" />}
        iconAfter={<Icon name="ArrowRight" />}
        label={t('brand_location.update.groups.address.title')}
        text={
          [value.address, value.entrance, value.floor]
            .filter(Boolean)
            .join(' · ') || t('shared.not_specified')
        }
        onPress={openModal}
      />

      <SlideSheetModal
        scrollable
        headerTitle={t('brand_location.update.groups.address.title')}
        visible={modalVisible}
        onClose={closeModal}
      >
        <FormView gap="$5" paddingVertical={defaultPageVerticalPadding}>
          <StringForm
            name="address"
            value={value.address}
            onUpdate={updateValue}
            Controller={BrandLocationAddressController}
          />
          <StringForm
            name="entrance"
            value={value.entrance}
            onUpdate={updateValue}
            Controller={BrandLocationEntranceController}
          />
          <StringForm
            name="floor"
            value={value.floor}
            onUpdate={updateValue}
            Controller={BrandLocationFloorController}
          />
          <StringForm
            name="remark"
            value={value.remark}
            onUpdate={updateValue}
            Controller={BrandLocationRemarkController}
          />
        </FormView>
      </SlideSheetModal>
    </>
  );
};

const Schedule = ({ location }: { location: BrandLocation }) => {
  const { t } = useTranslation();
  const { me } = useCurrentAccount();
  const { value, modalVisible, openModal, closeModal, updateValue } =
    useModalUpdateByIdForm<
      BrandLocation,
      { schedules: TSchedule[] },
      TUpdateBrandLocation
    >({
      id: location.id,
      query: useUpdateBrandLocationQuery,
      initialValue: {
        schedules: location.schedules,
      },
    });

  const text = useMemo(() => {
    const date = DateHelper.startOfDay(new Date());
    const weekdays = DateHelper.getWeekdays({
      weekStartsOn: me?.preferences?.weekStartsOn,
      formatStr: 'eee',
    });

    return weekdays
      .map((weekday) => {
        const schedule = value.schedules.find(
          ({ day }) => day === weekday.value,
        );

        if (!schedule) return '';

        const dayValue =
          !schedule.start && !schedule.end
            ? `- ${t('shared.schedule.day_off')}`
            : `${DateHelper.format(
                DateHelper.set(date, {
                  minutes: schedule.start,
                }),
                'p',
              )} - ${DateHelper.format(
                DateHelper.set(date, {
                  minutes: schedule.end,
                }),
                'p',
              )}`;

        return `${weekday.label} ${dayValue}`;
      })
      .join(' · ');
  }, [me?.preferences?.weekStartsOn, t, value]);

  return (
    <>
      <ListItem
        icon={<Icon name="Calendar" />}
        iconAfter={<Icon name="ArrowRight" />}
        label={t('brand_location.update.groups.schedule.title')}
        text={text}
        onPress={openModal}
      />

      <SlideSheetModal
        scrollable
        headerTitle={t('brand_location.update.groups.schedule.title')}
        visible={modalVisible}
        onClose={closeModal}
      >
        <FormView paddingVertical={defaultPageVerticalPadding}>
          <ArrayForm
            name="schedules"
            value={value.schedules}
            onUpdate={updateValue}
            Controller={BrandLocationScheduleController}
          />
        </FormView>
      </SlideSheetModal>
    </>
  );
};

const Locale = ({ location }: { location: BrandLocation }) => {
  const { t } = useTranslation();
  const { brand } = useCurrentBrandState();
  const { value, modalVisible, openModal, closeModal, updateValue } =
    useModalUpdateByIdForm<
      BrandLocation,
      {
        country: string;
        usState: string | null;
        currencies: string[];
        timezone: string;
      },
      TUpdateBrandLocation
    >({
      id: location.id,
      query: useUpdateBrandLocationQuery,
      initialValue: {
        country: location.country?.value,
        usState: location.usState?.abbreviation,
        currencies: location.currencies,
        timezone: location.timezone,
      },
    });

  const canChangeCountry = brand?.countries && brand.countries?.length > 1;
  const canChangeCurrencies = brand?.currencies && brand.currencies?.length > 1;

  return (
    <>
      <ListItem
        icon={<Icon name="Earth" />}
        iconAfter={<Icon name="ArrowRight" />}
        label={t('brand_location.update.groups.locale.title')}
        text={
          [
            canChangeCountry ? value.country : '',
            canChangeCurrencies ? value.currencies.join(', ') : '',
            value.timezone,
          ]
            .filter(Boolean)
            .join(' · ') || t('shared.not_specified')
        }
        onPress={openModal}
      />

      <SlideSheetModal
        scrollable
        headerTitle={t('brand_location.update.groups.locale.title')}
        visible={modalVisible}
        onClose={closeModal}
      >
        <FormView gap="$5" paddingVertical={defaultPageVerticalPadding}>
          {canChangeCountry && (
            <BrandLocationCountryForm
              country={value.country}
              usState={value.usState}
              onUpdate={updateValue}
            />
          )}

          {canChangeCurrencies && (
            <SingleStringArrayForm
              name="currencies"
              value={value.currencies}
              onUpdate={updateValue}
              Controller={BrandLocationCurrencyController}
            />
          )}

          <BrandLocationTimezoneForm
            country={value.country}
            timezone={value.timezone}
            onUpdate={updateValue}
          />
        </FormView>
      </SlideSheetModal>
    </>
  );
};

const Advantages = ({ location }: { location: BrandLocation }) => {
  const { t } = useTranslation();
  const { value, modalVisible, openModal, closeModal, updateValue } =
    useModalUpdateByIdForm<
      BrandLocation,
      {
        advantages: string[];
      },
      TUpdateBrandLocation
    >({
      id: location.id,
      query: useUpdateBrandLocationQuery,
      initialValue: {
        advantages: location.advantages?.map(({ value }) => value) || [],
      },
    });

  return (
    <>
      <ListItem
        icon={<Icon name="ChecklistMinimalistic" />}
        iconAfter={<Icon name="ArrowRight" />}
        label={t('brand_location.update.groups.advantages.title')}
        text={
          location.advantages?.map(({ label }) => label).join(' · ') ||
          t('shared.not_specified')
        }
        onPress={openModal}
      />

      <SlideSheetModal
        scrollable
        headerTitle={t('brand_location.update.groups.advantages.title')}
        visible={modalVisible}
        onClose={closeModal}
      >
        <FormView gap="$5" paddingVertical={defaultPageVerticalPadding}>
          <BrandLocationAdvantagesForm
            advantages={value.advantages}
            onUpdate={updateValue}
          />
        </FormView>
      </SlideSheetModal>
    </>
  );
};

const Contact = ({ location }: { location: BrandLocation }) => {
  const { t } = useTranslation();
  const { value, modalVisible, openModal, closeModal, updateValue } =
    useModalUpdateByIdForm<
      BrandLocation,
      {
        phones: string[];
        emails: string[];
        instagrams: string[];
      },
      TUpdateBrandLocation
    >({
      id: location.id,
      query: useUpdateBrandLocationQuery,
      initialValue: {
        phones: location.phones || [],
        emails: location.emails || [],
        instagrams: location.instagrams || [],
      },
    });

  return (
    <>
      <ListItem
        icon={<Icon name="ChatRoundDots" />}
        iconAfter={<Icon name="ArrowRight" />}
        label={t('brand_location.update.groups.contact.title')}
        text={
          [
            value.phones
              ?.map((phone) =>
                PhoneNumber.format(
                  phone,
                  PhoneNumber.getCountryCodeOfNumber(phone),
                ),
              )
              .filter(Boolean)
              .join(', '),
            location.emails.join(', '),
            location.instagrams.map(getNicknameFromUrl).join(', '),
          ]
            .filter(Boolean)
            .join(' · ') || t('shared.not_specified')
        }
        onPress={openModal}
      />

      <SlideSheetModal
        scrollable
        headerTitle={t('brand_location.update.groups.contact.title')}
        visible={modalVisible}
        onClose={closeModal}
      >
        <FormView gap="$5" paddingVertical={defaultPageVerticalPadding}>
          <SingleStringArrayForm
            name="phones"
            value={value.phones}
            onUpdate={updateValue}
            Controller={BrandLocationPhoneController}
          />
          <SingleStringArrayForm
            name="emails"
            value={value.emails}
            onUpdate={updateValue}
            Controller={BrandLocationEmailController}
          />
          <SingleStringArrayForm
            name="instagrams"
            value={value.instagrams}
            onUpdate={updateValue}
            Controller={BrandLocationInstagramController}
          />
        </FormView>
      </SlideSheetModal>
    </>
  );
};
