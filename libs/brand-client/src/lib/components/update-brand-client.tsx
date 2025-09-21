import {
  BrandClient,
  UpdateBrandClient as TUpdateBrandClient,
  useModalUpdateByIdForm,
  useUpdateBrandClientQuery,
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
import { BrandClientAvatarForm } from './form/brand-client-avatar-form';
import { useCurrentAccount } from '@symbiot-core-apps/state';
import { DateHelper } from '@symbiot-core-apps/shared';
import { useTranslation } from 'react-i18next';
import { BrandClientFirstnameForm } from './form/brand-client-firstname-form';
import { BrandClientLastnameForm } from './form/brand-client-lastname-form';
import { BrandClientGenderForm } from './form/brand-client-gender-form';
import { BrandClientBirthdayForm } from './form/brand-client-birthday-form';
import { BrandClientPhonesForm } from './form/brand-client-phones-form';
import { BrandClientEmailsForm } from './form/brand-client-emails-form';
import { BrandClientAddressesForm } from './form/brand-client-adresses-form';
import { BrandClientNoteForm } from './form/brand-client-note-form';

export const UpdateBrandClient = ({ client }: { client: BrandClient }) => {
  return (
    <PageView scrollable withHeaderHeight withKeyboard gap="$5">
      <FormView gap="$10" paddingVertical="$5">
        <BrandClientAvatarForm client={client} />

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
  const { t } = useTranslation();
  const { me } = useCurrentAccount();
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
      query: useUpdateBrandClientQuery,
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
          <BrandClientFirstnameForm
            firstname={value.firstname}
            onUpdate={updateValue}
          />
          <BrandClientLastnameForm
            lastname={value.lastname}
            onUpdate={updateValue}
          />
          <BrandClientGenderForm gender={value.gender} onUpdate={updateValue} />
          <BrandClientBirthdayForm
            birthday={value.birthday}
            onUpdate={updateValue}
          />
        </FormView>
      </SlideSheetModal>
    </>
  );
};

const Contact = ({ client }: { client: BrandClient }) => {
  const { t } = useTranslation();
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
      query: useUpdateBrandClientQuery,
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
            value.phones.join(', '),
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
          <BrandClientPhonesForm phones={value.phones} onUpdate={updateValue} />
          <BrandClientEmailsForm emails={value.emails} onUpdate={updateValue} />
          <BrandClientAddressesForm
            addresses={value.addresses}
            onUpdate={updateValue}
          />
        </FormView>
      </SlideSheetModal>
    </>
  );
};

const Note = ({ client }: { client: BrandClient }) => {
  const { t } = useTranslation();
  const { value, modalVisible, updateValue, openModal, closeModal } =
    useModalUpdateByIdForm<
      BrandClient,
      {
        note: string;
      },
      TUpdateBrandClient
    >({
      id: client.id,
      query: useUpdateBrandClientQuery,
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
          value.note?.replace(/\n/gi, ' ').replace(/\s\s/gi, '') ||
          t('shared.not_specified')
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
          <BrandClientNoteForm note={value.note} onUpdate={updateValue} />
        </FormView>
      </SlideSheetModal>
    </>
  );
};
