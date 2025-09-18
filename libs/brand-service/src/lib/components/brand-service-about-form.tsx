import {
  BrandService,
  UpdateBrandService,
  useModalUpdateForm,
  useUpdateBrandServiceQuery,
} from '@symbiot-core-apps/api';
import { useBrandServiceForm } from '../hooks/use-brand-service-form';
import {
  defaultPageVerticalPadding,
  FormView,
  Icon,
  Input,
  ListItem,
  SlideSheetModal,
  Textarea,
} from '@symbiot-core-apps/ui';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useLayoutEffect } from 'react';

type FormValue = {
  name: string;
  description: string;
};

export const BrandServiceAboutForm = ({
  service,
}: {
  service: BrandService;
}) => {
  const { about } = useBrandServiceForm();
  const { value, modalVisible, openModal, closeModal, updateValue } =
    useModalUpdateForm<BrandService, FormValue, UpdateBrandService>({
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
        label={about.title}
        text={[value.name, value.description].filter(Boolean).join(' · ')}
        onPress={openModal}
      />

      <SlideSheetModal
        scrollable
        headerTitle={about.title}
        visible={modalVisible}
        onClose={closeModal}
      >
        <Form {...value} onUpdateValue={updateValue} />
      </SlideSheetModal>
    </>
  );
};

const Form = ({
  name,
  description,
  onUpdateValue,
}: FormValue & {
  onUpdateValue: (value: Partial<FormValue>) => unknown;
}) => {
  const form = useBrandServiceForm();

  const {
    control: nameControl,
    handleSubmit: nameHandleSubmit,
    setValue: setNameValue,
  } = useForm<{
    name: string;
  }>({
    defaultValues: { name },
    resolver: yupResolver(
      yup
        .object()
        .shape({
          name: form.name.scheme,
        })
        .required(),
    ),
  });

  const {
    control: descriptionControl,
    handleSubmit: descriptionHandleSubmit,
    setValue: setDescriptionValue,
  } = useForm<{
    description: string;
  }>({
    defaultValues: { description },
    resolver: yupResolver(
      yup
        .object()
        .shape({
          description: form.description.scheme,
        })
        .required(),
    ),
  });

  useLayoutEffect(() => {
    setNameValue('name', name);
  }, [name, setNameValue]);

  useLayoutEffect(() => {
    setDescriptionValue('description', description);
  }, [description, setDescriptionValue]);

  return (
    <FormView gap="$5" paddingVertical={defaultPageVerticalPadding}>
      <Controller
        control={nameControl}
        name="name"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <Input
            value={value}
            maxLength={64}
            label={form.name.label}
            placeholder={form.name.placeholder}
            error={error?.message}
            onChange={onChange}
            onBlur={nameHandleSubmit(onUpdateValue)}
          />
        )}
      />

      <Controller
        control={descriptionControl}
        name="description"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <Textarea
            countCharacters
            enterKeyHint="done"
            value={value}
            error={error?.message}
            placeholder={form.description.placeholder}
            onChange={onChange}
            onBlur={descriptionHandleSubmit(onUpdateValue)}
          />
        )}
      />
    </FormView>
  );
};
