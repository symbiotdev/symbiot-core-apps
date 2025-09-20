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
import { BrandWebsitesController } from './contoller/brand-websites-controller';
import { BrandInstagramsController } from './contoller/brand-instagrams-controller';
import { BrandBirthdayController } from './contoller/brand-birthday-controller';
import { BrandAboutController } from './contoller/brand-about-controller';
import {
  Brand,
  UpdateBrand as TUpdateBrand,
  useCurrentBrandUpdate,
  useModalUpdateForm,
} from '@symbiot-core-apps/api';
import { useCallback } from 'react';
import { ImagePickerAsset } from 'expo-image-picker';
import { BrandCountriesController } from './contoller/brand-countries-controller';
import { BrandCurrenciesController } from './contoller/brand-currencies-controller';
import { useTranslation } from 'react-i18next';
import { DateHelper } from '@symbiot-core-apps/shared';
import { BrandNameForm } from './form/brand-name-form';

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

        <FormView>
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

const Information = ({ brand, onUpdated }: GroupProps) => {
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
      onUpdated,
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
          <BrandNameForm name={value.name} onUpdate={updateValue} />
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

const Localization = ({ brand, onUpdated }: GroupProps) => {
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
