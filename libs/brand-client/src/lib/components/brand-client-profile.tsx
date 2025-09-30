import {
  BrandClient,
  UpdateBrandClient as TUpdateBrandClient,
  useModalUpdateByIdForm,
  useUpdateBrandClientQuery,
} from '@symbiot-core-apps/api';
import {
  Avatar,
  ButtonIcon,
  Card,
  defaultPageVerticalPadding,
  FormView,
  formViewStyles,
  H3,
  Icon,
  ListItem,
  ListItemGroup,
  PageView,
  RegularText,
  SlideSheetModal,
} from '@symbiot-core-apps/ui';
import { DateHelper } from '@symbiot-core-apps/shared';
import { useCurrentAccountState } from '@symbiot-core-apps/state';
import { XStack } from 'tamagui';
import { useCallback } from 'react';
import { Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SingeElementForm } from '@symbiot-core-apps/form-controller';
import { BrandClientNoteController } from './controller/brand-client-note-controller';
import { useApp } from '@symbiot-core-apps/app';
import { router } from 'expo-router';

export const BrandClientProfile = ({ client }: { client: BrandClient }) => {
  return (
    <PageView scrollable withHeaderHeight gap="$5">
      <Header client={client} />
      <Note client={client} />
      <Balance client={client} />
      <History client={client} />
    </PageView>
  );
};

const Header = ({ client }: { client: BrandClient }) => {
  const { me } = useCurrentAccountState();

  const onPhonePress = useCallback(
    () => Linking.openURL(`tel:${client.phones[0]}`),
    [client.phones],
  );

  const onEmailPress = useCallback(
    () => Linking.openURL(`mailto:${client.emails[0]}`),
    [client.emails],
  );

  const name = `${client.firstname} ${client.lastname}`;

  return (
    <Card style={formViewStyles} alignItems="center" gap="$3">
      <Avatar
        color="$background"
        name={name}
        url={client.avatarXsUrl}
        size={100}
      />

      <H3 textAlign="center">{name}</H3>

      {(client.gender || client.birthday) && (
        <RegularText color="$placeholderColor" textAlign="center">
          {[
            client.birthday
              ? DateHelper.format(client.birthday, me?.preferences?.dateFormat)
              : '',
            client.gender?.label,
          ]
            .filter(Boolean)
            .join(' · ')}
        </RegularText>
      )}

      <XStack justifyContent="center" gap="$2">
        <ButtonIcon
          iconName="Phone"
          size={40}
          iconSize={20}
          iconStyle={{ marginLeft: -2, marginBottom: -2 }}
          disabled={!client.phones?.length}
          onPress={onPhonePress}
        />

        <ButtonIcon
          iconName="Letter"
          size={40}
          iconSize={20}
          disabled={!client.emails?.length}
          onPress={onEmailPress}
        />
      </XStack>
    </Card>
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
      <ListItemGroup
        title={t('brand_client.profile.note')}
        pressStyle={{ opacity: 0.8 }}
        onPress={openModal}
      >
        <RegularText
          color={!value.note ? '$disabled' : undefined}
          textAlign={value.note ? 'left' : 'center'}
          paddingVertical="$2"
        >
          {value.note || t('shared.not_specified')}
        </RegularText>
      </ListItemGroup>

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

const Balance = ({ client }: { client: BrandClient }) => {
  const { t } = useTranslation();
  const { icons } = useApp();

  return (
    <ListItemGroup title={t('brand_client.profile.balance')}>
      <RegularText color="$disabled" textAlign="center" paddingVertical="$2">
        {t('shared.its_empty')}
      </RegularText>
    </ListItemGroup>
  );
};

const History = ({ client }: { client: BrandClient }) => {
  const { t } = useTranslation();
  const { icons } = useApp();

  return (
    <ListItemGroup title={t('brand_client.profile.history')}>
      <ListItem
        label={t('brand_client.profile.history_menu.tickets')}
        icon={<Icon name={icons.Ticket} />}
        iconAfter={<Icon name="ArrowRight" />}
        onPress={() => router.push(`/clients/${client.id}/tickets`)}
      />
      <ListItem
        label={t('brand_client.profile.history_menu.memberships')}
        icon={<Icon name={icons.Membership} />}
        iconAfter={<Icon name="ArrowRight" />}
        onPress={() => router.push(`/clients/${client.id}/memberships`)}
      />
    </ListItemGroup>
  );
};
