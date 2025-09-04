import { useTranslation } from 'react-i18next';
import { BrandEmployee } from '@symbiot-core-apps/api';
import { useBrandEmployeeForm } from '../hooks/use-brand-employee-form';
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
import { useUpdateBrandEmployeeForm } from '../hooks/use-update-brand-employee-form';

type FormValue = {
  about: string;
};

export const BrandEmployeeAboutForm = ({
  employee,
}: {
  employee: BrandEmployee;
}) => {
  const { t } = useTranslation();
  const form = useBrandEmployeeForm();
  const { value, modalVisible, openModal, closeModal, updateValue } =
    useUpdateBrandEmployeeForm<FormValue>({
      id: employee.id,
      initialValue: {
        about: employee.about,
      },
    });

  return (
    <>
      <ListItem
        icon={<Icon name="InfoCircle" />}
        iconAfter={<Icon name="ArrowRight" />}
        label={form.about.title}
        text={value.about || t('shared.not_specified')}
        onPress={openModal}
      />

      <SlideSheetModal
        scrollable
        headerTitle={form.identificationInfo.title}
        visible={modalVisible}
        onClose={closeModal}
      >
        <Form {...value} onUpdateValue={updateValue} />
      </SlideSheetModal>
    </>
  );
};

const Form = ({
  about,
  onUpdateValue,
}: FormValue & {
  onUpdateValue: (value: Partial<FormValue>) => unknown;
}) => {
  const form = useBrandEmployeeForm();

  const {
    control: aboutControl,
    handleSubmit: aboutHandleSubmit,
    setValue: setAboutValue,
  } = useForm<{
    about: string;
  }>({
    defaultValues: { about },
    resolver: yupResolver(
      yup
        .object()
        .shape({
          about: form.about.scheme,
        })
        .required(),
    ),
  });

  useEffect(() => {
    setAboutValue('about', about);
  }, [setAboutValue, about]);

  return (
    <FormView gap="$5" paddingVertical={defaultPageVerticalPadding}>
      <Controller
        control={aboutControl}
        name="about"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <Textarea
            countCharacters
            enterKeyHint="done"
            value={value}
            error={error?.message}
            label={form.about.label}
            placeholder={form.about.placeholder}
            onChange={onChange}
            onBlur={aboutHandleSubmit(onUpdateValue)}
          />
        )}
      />
    </FormView>
  );
};
