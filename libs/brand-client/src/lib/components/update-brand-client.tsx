import {
  BrandClient,
  UpdateBrandClient as TUpdateBrandClient,
  useModalUpdateByIdForm,
  useUpdateBrandClientReq,
} from '@symbiot-core-apps/api';
import {
  defaultPageVerticalPadding,
  FormView,
  Icon,
  ListItem,
  ListItemGroup,
  PageView,
  SlideSheetModal,
} from '@symbiot-core-apps/ui';
import { useCurrentAccountState } from '@symbiot-core-apps/state';
import { DateHelper, useI18n } from '@symbiot-core-apps/shared';
import {
  AvatarPicker,
  DateFrom,
  SingeElementForm,
  SingleElementToArrayForm,
} from '@symbiot-core-apps/form-controller';
import { BrandClientAddressController } from './controller/brand-client-address-controller';
import { useCallback } from 'react';
import { ImagePickerAsset } from 'expo-image-picker';
import { BrandClientBirthdayController } from './controller/brand-client-birthday-controller';
import { BrandClientEmailController } from './controller/brand-client-email-controller';
import { BrandClientFirstnameController } from './controller/brand-client-firstname-controller';
import { BrandClientGenderController } from './controller/brand-client-gender-controller';
import { BrandClientLastnameController } from './controller/brand-client-lastname-controller';
import { BrandClientNoteController } from './controller/brand-client-note-controller';
import { BrandClientPhoneController } from './controller/brand-client-phone-controller';
import { PhoneNumber } from 'react-native-phone-input/dist';

export const UpdateBrandClient = ({ client }: { client: BrandClient }) => {
  const { mutateAsync: updateAvatar, isPending: avatarUpdating } =
    useUpdateBrandClientReq();

  const onAddAvatar = useCallback(
    (avatar: ImagePickerAsset) =>
      updateAvatar({
        id: client.id,
        data: {
          avatar,
        },
      }),
    [client.id, updateAvatar],
  );

  return (
    <PageView scrollable withHeaderHeight withKeyboard gap="$5">
      <FormView gap="$10" paddingVertical="$5">
        <AvatarPicker
          marginHorizontal="auto"
          loading={avatarUpdating}
          name={`${client.firstname} ${client.lastname}`}
          color="$background1"
          url={client.avatar?.url}
          size={100}
          onAttach={onAddAvatar}
        />

        <ListItemGroup>
          <Personality client={client} />
          <Contact client={client} />
          <Note client={client} />
        </ListItemGroup>
      </FormView>
    </PageView>
  );
};

const Personality = ({ client }: { client: BrandClient }) => {
  const { me } = useCurrentAccountState();
  const { t } = useI18n();
  const { value, modalVisible, openModal, closeModal, updateValue } =
    useModalUpdateByIdForm<
      BrandClient,
      {
        firstname: string;
        lastname: string;
        gender: string;
        birthday: string | null;
      },
      TUpdateBrandClient
    >({
      id: client.id,
      query: useUpdateBrandClientReq,
      initialValue: {
        firstname: client.firstname,
        lastname: client.lastname,
        gender: client.gender?.value,
        birthday: client.birthday,
      },
    });

  return (
    <>
      <ListItem
        icon={<Icon name="UserCircle" />}
        iconAfter={<Icon name="ArrowRight" />}
        label={t('brand_client.update.groups.personality.title')}
        text={[
          `${value.firstname} ${value.lastname}`,
          value.birthday &&
            DateHelper.format(value.birthday, me?.preferences?.dateFormat),
          client.gender?.label,
        ]
          .filter(Boolean)
          .join(' · ')}
        onPress={openModal}
      />

      <SlideSheetModal
        scrollable
        headerTitle={t('brand_client.update.groups.personality.title')}
        visible={modalVisible}
        onClose={closeModal}
      >
        <FormView gap="$5" paddingVertical={defaultPageVerticalPadding}>
          <SingeElementForm
            name="firstname"
            value={value.firstname}
            onUpdate={updateValue}
            Controller={BrandClientFirstnameController}
          />
          <SingeElementForm
            name="lastname"
            value={value.lastname}
            onUpdate={updateValue}
            Controller={BrandClientLastnameController}
          />
          <SingeElementForm
            name="gender"
            value={value.gender}
            controllerProps={{
              disableDrag: true,
            }}
            onUpdate={updateValue}
            Controller={BrandClientGenderController}
          />
          <DateFrom
            name="birthday"
            value={value.birthday}
            controllerProps={{
              disableDrag: true,
            }}
            onUpdate={updateValue}
            Controller={BrandClientBirthdayController}
          />
        </FormView>
      </SlideSheetModal>
    </>
  );
};

const Contact = ({ client }: { client: BrandClient }) => {
  const { t } = useI18n();
  const { value, modalVisible, updateValue, openModal, closeModal } =
    useModalUpdateByIdForm<
      BrandClient,
      {
        phones: string[];
        emails: string[];
        addresses: string[];
      },
      TUpdateBrandClient
    >({
      id: client.id,
      query: useUpdateBrandClientReq,
      initialValue: {
        emails: client.emails || [],
        phones: client.phones || [],
        addresses: client.addresses || [],
      },
    });

  return (
    <>
      <ListItem
        icon={<Icon name="ChatRoundDots" />}
        iconAfter={<Icon name="ArrowRight" />}
        label={t('brand_client.update.groups.contact.title')}
        text={
          [
            value.phones
              .map((phone) =>
                PhoneNumber.format(
                  phone,
                  PhoneNumber.getCountryCodeOfNumber(phone),
                ),
              )
              .filter(Boolean)
              .join(', '),
            value.emails.join(', '),
            value.addresses.join(', '),
          ]
            .filter(Boolean)
            .join(' · ') || t('shared.not_specified')
        }
        onPress={openModal}
      />

      <SlideSheetModal
        scrollable
        headerTitle={t('brand_client.update.groups.contact.title')}
        visible={modalVisible}
        onClose={closeModal}
      >
        <FormView gap="$5" paddingVertical={defaultPageVerticalPadding}>
          <SingleElementToArrayForm
            name="phones"
            value={value.phones}
            onUpdate={updateValue}
            Controller={BrandClientPhoneController}
          />
          <SingleElementToArrayForm
            name="emails"
            value={value.emails}
            onUpdate={updateValue}
            Controller={BrandClientEmailController}
          />
          <SingleElementToArrayForm
            name="addresses"
            value={value.addresses}
            onUpdate={updateValue}
            Controller={BrandClientAddressController}
          />
        </FormView>
      </SlideSheetModal>
    </>
  );
};

const Note = ({ client }: { client: BrandClient }) => {
  const { t } = useI18n();
  const { value, modalVisible, updateValue, openModal, closeModal } =
    useModalUpdateByIdForm<
      BrandClient,
      {
        note: string;
      },
      TUpdateBrandClient
    >({
      id: client.id,
      query: useUpdateBrandClientReq,
      initialValue: {
        note: client.note,
      },
    });

  return (
    <>
      <ListItem
        icon={<Icon name="Document" />}
        iconAfter={<Icon name="ArrowRight" />}
        label={t('brand_client.update.groups.note.title')}
        text={
          value.note?.replace(/\n/gi, ' ')?.trim() || t('shared.not_specified')
        }
        onPress={openModal}
      />

      <SlideSheetModal
        scrollable
        headerTitle={t('brand_client.update.groups.note.title')}
        visible={modalVisible}
        onClose={closeModal}
      >
        <FormView gap="$5" paddingVertical={defaultPageVerticalPadding}>
          <SingeElementForm
            name="note"
            value={value.note}
            onUpdate={updateValue}
            Controller={BrandClientNoteController}
          />
        </FormView>
      </SlideSheetModal>
    </>
  );
};
