import { useTranslation } from 'react-i18next';
import {
  BrandClient,
  UpdateBrandClient,
  useModalUpdateByIdForm,
  useUpdateBrandClientQuery,
} from '@symbiot-core-apps/api';
import { useEffect } from 'react';
import {
  defaultPageVerticalPadding,
  FormView,
  Icon,
  ListItem,
  SlideSheetModal,
  Textarea,
} from '@symbiot-core-apps/ui';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useBrandClientForm } from '../hooks/use-brand-client-form';
import { useWindowDimensions } from 'react-native';

type FormValue = {
  note: string;
};

export const BrandClientNoteForm = ({ client }: { client: BrandClient }) => {
  const { t } = useTranslation();
  const form = useBrandClientForm();
  const { value, modalVisible, openModal, closeModal, updateValue } =
    useModalUpdateByIdForm<BrandClient, FormValue, UpdateBrandClient>({
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
        label={form.note.title}
        text={
          value.note?.replace(/\n/gi, ' ').replace(/\s\s/gi, '') ||
          t('shared.not_specified')
        }
        onPress={openModal}
      />

      <SlideSheetModal
        scrollable
        headerTitle={form.note.title}
        visible={modalVisible}
        onClose={closeModal}
      >
        <Form {...value} onUpdateValue={updateValue} />
      </SlideSheetModal>
    </>
  );
};

const Form = ({
  note,
  onUpdateValue,
}: FormValue & {
  onUpdateValue: (value: Partial<FormValue>) => unknown;
}) => {
  const form = useBrandClientForm();
  const { height } = useWindowDimensions();

  const {
    control: noteControl,
    handleSubmit: noteHandleSubmit,
    setValue: setNoteValue,
  } = useForm<{
    note: string;
  }>({
    defaultValues: { note },
    resolver: yupResolver(
      yup
        .object()
        .shape({
          note: form.note.scheme,
        })
        .required(),
    ),
  });

  useEffect(() => {
    setNoteValue('note', note);
  }, [setNoteValue, note]);

  return (
    <FormView gap="$5" paddingVertical={defaultPageVerticalPadding}>
      <Controller
        control={noteControl}
        name="note"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <Textarea
            countCharacters
            enterKeyHint="done"
            maxHeight={Math.min(height - 200, 500)}
            value={value}
            error={error?.message}
            placeholder={form.note.subtitle}
            maxLength={form.note.maxLength}
            onChange={onChange}
            onBlur={noteHandleSubmit(onUpdateValue)}
          />
        )}
      />
    </FormView>
  );
};
