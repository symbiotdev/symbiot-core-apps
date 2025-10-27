import {
  BrandClient,
  UpdateBrandClient as TUpdateBrandClient,
  useModalUpdateByIdForm,
  useUpdateBrandClientReq,
} from '@symbiot-core-apps/api';
import { useTranslation } from 'react-i18next';
import {
  defaultPageVerticalPadding,
  FormView,
  ListItemGroup,
  RegularText,
  SlideSheetModal,
} from '@symbiot-core-apps/ui';
import { SingeElementForm } from '@symbiot-core-apps/form-controller';
import { BrandClientNoteController } from './controller/brand-client-note-controller';
import React from 'react';

export const BrandClientNote = ({ client }: { client: BrandClient }) => {
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
      query: useUpdateBrandClientReq,
      initialValue: {
        note: client.note,
      },
    });

  return (
    <>
      <ListItemGroup
        cursor="pointer"
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
