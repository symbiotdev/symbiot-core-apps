import {
  AvatarPicker,
  defaultPageHorizontalPadding,
  defaultPageVerticalPadding,
  FormView,
  getNicknameFromUrl,
  getWebsiteDomain,
  Icon,
  ListItem,
  ListItemGroup,
  PageView,
  SlideSheetModal,
} from '@symbiot-core-apps/ui';
import {
  useCurrentAccount,
  useCurrentBrandState,
} from '@symbiot-core-apps/state';
import {
  Brand,
  UpdateBrand as TUpdateBrand,
  useCurrentBrandUpdate,
  useModalUpdateForm,
} from '@symbiot-core-apps/api';
import { useCallback } from 'react';
import { ImagePickerAsset } from 'expo-image-picker';
import { useTranslation } from 'react-i18next';
import { DateHelper } from '@symbiot-core-apps/shared';
import {
  DateFrom,
  SingleElementToArrayForm,
  SingeElementForm,
} from '@symbiot-core-apps/form-controller';
import { BrandAboutController } from './contoller/brand-about-controller';
import { BrandBirthdayController } from './contoller/brand-birthday-controller';
import { BrandNameController } from './contoller/brand-name-controller';
import { BrandCountryController } from './contoller/brand-country-controller';
import { BrandCurrencyController } from './contoller/brand-currency-controller';
import { BrandWebsiteController } from './contoller/brand-website-controller';
import { BrandInstagramController } from './contoller/brand-instagram-controller';

type GroupProps = {
  brand: Brand;
  onUpdated: (brand: Brand) => void;
};

export const UpdateBrand = () => {
  const { brand, setBrand } = useCurrentBrandState();
  const { mutateAsync: updateAvatar, isPending: isAvatarUpdating } =
    useCurrentBrandUpdate();

  const updateAvatar$ = useCallback(
    async (avatar: ImagePickerAsset) =>
      setBrand(await updateAvatar({ avatar })),
    [updateAvatar, setBrand],
  );

  return (
    brand && (
      <PageView scrollable withHeaderHeight withKeyboard gap="$5">
        <AvatarPicker
          alignSelf="center"
          loading={isAvatarUpdating}
          name={brand.name}
          color={brand.avatarColor}
          url={brand.avatarUrl}
          size={100}
          onAttach={updateAvatar$}
        />

        <FormView paddingHorizontal={defaultPageHorizontalPadding}>
          <Name brand={brand} onUpdated={setBrand} />

          <ListItemGroup>
            <Information brand={brand} onUpdated={setBrand} />
            <Localization brand={brand} onUpdated={setBrand} />
            <ExternalLinks brand={brand} onUpdated={setBrand} />
          </ListItemGroup>
        </FormView>
      </PageView>
    )
  );
};

const Name = ({ brand, onUpdated }: GroupProps) => {
  const { mutateAsync } = useCurrentBrandUpdate();

  const update = useCallback(
    async (data: TUpdateBrand) => onUpdated(await mutateAsync(data)),
    [mutateAsync, onUpdated],
  );

  return (
    <SingeElementForm
      name="name"
      value={brand.name}
      onUpdate={update}
      Controller={BrandNameController}
    />
  );
};

const Information = ({ brand, onUpdated }: GroupProps) => {
  const { t } = useTranslation();
  const { me } = useCurrentAccount();
  const { value, modalVisible, openModal, closeModal, updateValue } =
    useModalUpdateForm<
      Brand,
      { about: string; birthday: string | null },
      TUpdateBrand
    >({
      query: useCurrentBrandUpdate,
      initialValue: {
        about: brand.about,
        birthday: brand.birthday,
      },
      onUpdated,
    });

  return (
    <>
      <ListItem
        icon={<Icon name="InfoCircle" />}
        iconAfter={<Icon name="ArrowRight" />}
        label={t('brand.update.groups.information.title')}
        text={
          [
            value.birthday
              ? DateHelper.format(value.birthday, me?.preferences?.dateFormat)
              : '',
            value.about,
          ]
            .filter(Boolean)
            .join(' · ') || t('shared.not_specified')
        }
        onPress={openModal}
      />

      <SlideSheetModal
        scrollable
        headerTitle={t('brand.update.groups.information.title')}
        visible={modalVisible}
        onClose={closeModal}
      >
        <FormView gap="$5" paddingVertical={defaultPageVerticalPadding}>
          <DateFrom
            name="birthday"
            value={brand.birthday}
            onUpdate={updateValue}
            Controller={BrandBirthdayController}
          />
          <SingeElementForm
            name="about"
            value={value.about}
            onUpdate={updateValue}
            Controller={BrandAboutController}
          />
        </FormView>
      </SlideSheetModal>
    </>
  );
};

const Localization = ({ brand, onUpdated }: GroupProps) => {
  const { t } = useTranslation();

  const { value, modalVisible, openModal, closeModal, updateValue, updating } =
    useModalUpdateForm<
      Brand,
      { countries: string[]; currencies: string[] },
      TUpdateBrand
    >({
      query: useCurrentBrandUpdate,
      initialValue: {
        countries: brand.countries.map(({ value }) => value),
        currencies: brand.currencies.map(({ value }) => value),
      },
      onUpdated,
    });

  return (
    <>
      <ListItem
        icon={<Icon name="Earth" />}
        iconAfter={<Icon name="ArrowRight" />}
        label={t('brand.update.groups.localization.title')}
        text={[value.countries.join(', '), value.currencies.join(', ')]
          .filter(Boolean)
          .join(' · ')}
        onPress={openModal}
      />

      <SlideSheetModal
        scrollable
        headerTitle={t('brand.update.groups.localization.title')}
        visible={modalVisible}
        onClose={closeModal}
      >
        <FormView gap="$5" paddingVertical={defaultPageVerticalPadding}>
          <SingleElementToArrayForm
            name="countries"
            value={value.countries}
            disabled={updating}
            onUpdate={updateValue}
            Controller={BrandCountryController}
          />
          <SingleElementToArrayForm
            name="currencies"
            disabled={updating}
            value={value.currencies}
            onUpdate={updateValue}
            Controller={BrandCurrencyController}
          />
        </FormView>
      </SlideSheetModal>
    </>
  );
};

const ExternalLinks = ({ brand, onUpdated }: GroupProps) => {
  const { t } = useTranslation();
  const { value, modalVisible, openModal, closeModal, updateValue } =
    useModalUpdateForm<
      Brand,
      { instagrams: string[]; websites: string[] },
      TUpdateBrand
    >({
      query: useCurrentBrandUpdate,
      initialValue: {
        instagrams: brand.instagrams,
        websites: brand.websites,
      },
      onUpdated,
    });

  return (
    <>
      <ListItem
        icon={<Icon name="PaperclipRounded" />}
        iconAfter={<Icon name="ArrowRight" />}
        label={t('brand.update.groups.links.title')}
        text={[
          value.instagrams.map(getNicknameFromUrl).join(', '),
          value.websites.map(getWebsiteDomain).join(', '),
        ]
          .filter(Boolean)
          .join(' · ')}
        onPress={openModal}
      />

      <SlideSheetModal
        scrollable
        headerTitle={t('brand.update.groups.links.title')}
        visible={modalVisible}
        onClose={closeModal}
      >
        <FormView gap="$5" paddingVertical={defaultPageVerticalPadding}>
          <SingleElementToArrayForm
            name="websites"
            value={value.websites}
            onUpdate={updateValue}
            Controller={BrandWebsiteController}
          />
          <SingleElementToArrayForm
            name="instagrams"
            value={value.instagrams}
            onUpdate={updateValue}
            Controller={BrandInstagramController}
          />
        </FormView>
      </SlideSheetModal>
    </>
  );
};
