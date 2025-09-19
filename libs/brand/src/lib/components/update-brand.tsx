import {
  AvatarPicker,
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
import { BrandNameController } from './contollers/brand-name-controller';
import { BrandWebsitesController } from './contollers/brand-websites-controller';
import { BrandInstagramsController } from './contollers/brand-instagrams-controller';
import { BrandBirthdayController } from './contollers/brand-birthday-controller';
import { BrandAboutController } from './contollers/brand-about-controller';
import {
  Brand,
  UpdateBrand as TUpdateBrand,
  useCurrentBrandUpdate,
  useModalUpdateForm,
} from '@symbiot-core-apps/api';
import { useCallback } from 'react';
import { ImagePickerAsset } from 'expo-image-picker';
import { BrandCountriesController } from './contollers/brand-countries-controller';
import { BrandCurrenciesController } from './contollers/brand-currencies-controller';
import { useTranslation } from 'react-i18next';
import { DateHelper } from '@symbiot-core-apps/shared';

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

        <FormView>
          <ListItemGroup>
            <Information brand={brand} />
            <Localization brand={brand} />
            <ExternalLinks brand={brand} />
          </ListItemGroup>
        </FormView>
      </PageView>
    )
  );
};

const Information = ({ brand }: { brand: Brand }) => {
  const { t } = useTranslation();
  const { me } = useCurrentAccount();
  const { value, modalVisible, openModal, closeModal, updateValue } =
    useModalUpdateForm<
      Brand,
      { name: string; about: string; birthday: string | null },
      TUpdateBrand
    >({
      query: useCurrentBrandUpdate,
      initialValue: {
        name: brand.name,
        about: brand.about,
        birthday: brand.birthday,
      },
    });

  return (
    <>
      <ListItem
        icon={<Icon name="InfoCircle" />}
        iconAfter={<Icon name="ArrowRight" />}
        label={t('brand.update.groups.information.title')}
        text={[
          value.name,
          value.birthday
            ? DateHelper.format(value.birthday, me?.preferences?.dateFormat)
            : '',
          value.about,
        ]
          .filter(Boolean)
          .join(' · ')}
        onPress={openModal}
      />

      <SlideSheetModal
        scrollable
        headerTitle={t('brand.update.groups.information.title')}
        visible={modalVisible}
        onClose={closeModal}
      >
        <FormView gap="$5" paddingVertical={defaultPageVerticalPadding}>
          <BrandNameController name={value.name} onUpdate={updateValue} />
          <BrandBirthdayController
            birthday={brand.birthday}
            onUpdate={updateValue}
          />
          <BrandAboutController about={value.about} onUpdate={updateValue} />
        </FormView>
      </SlideSheetModal>
    </>
  );
};

const Localization = ({ brand }: { brand: Brand }) => {
  const { t } = useTranslation();

  const { value, modalVisible, openModal, closeModal, updateValue } =
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
          <BrandCountriesController
            countries={value.countries}
            onUpdate={updateValue}
          />
          <BrandCurrenciesController
            currencies={value.currencies}
            onUpdate={updateValue}
          />
        </FormView>
      </SlideSheetModal>
    </>
  );
};

const ExternalLinks = ({ brand }: { brand: Brand }) => {
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
          <BrandWebsitesController
            websites={value.websites}
            onUpdate={updateValue}
          />
          <BrandInstagramsController
            instagrams={value.instagrams}
            onUpdate={updateValue}
          />
        </FormView>
      </SlideSheetModal>
    </>
  );
};
