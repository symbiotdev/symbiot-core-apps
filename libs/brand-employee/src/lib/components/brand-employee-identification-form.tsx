import { BrandEmployee } from '@symbiot-core-apps/api';
import {
  defaultPageVerticalPadding,
  FormView,
  Icon,
  Input,
  ListItem,
  SlideSheetModal,
} from '@symbiot-core-apps/ui';
import { useBrandEmployeeForm } from '../hooks/use-brand-employee-form';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useUpdateBrandEmployeeForm } from '../hooks/use-update-brand-employee-form';

type FormValue = {
  passport: string;
  taxId: string;
};

export const BrandEmployeeIdentificationForm = ({
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
        passport: employee.passport,
        taxId: employee.taxId,
      },
    });

  return (
    <>
      <ListItem
        icon={<Icon name="UserId" />}
        iconAfter={<Icon name="ArrowRight" />}
        label={form.identificationInfo.title}
        text={
          [value.passport, value.taxId].filter(Boolean).join(' · ') ||
          t('shared.not_specified')
        }
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
  passport,
  taxId,
  onUpdateValue,
}: FormValue & {
  onUpdateValue: (value: Partial<FormValue>) => unknown;
}) => {
  const form = useBrandEmployeeForm();

  const { control: passportControl, handleSubmit: passportHandleSubmit } =
    useForm<{
      passport: string;
    }>({
      defaultValues: { passport },
      resolver: yupResolver(
        yup
          .object()
          .shape({
            passport: form.passport.scheme,
          })
          .required(),
      ),
    });

  const { control: taxIdControl, handleSubmit: taxIdHandleSubmit } = useForm<{
    taxId: string;
  }>({
    defaultValues: { taxId },
    resolver: yupResolver(
      yup
        .object()
        .shape({
          taxId: form.taxId.scheme,
        })
        .required(),
    ),
  });

  return (
    <FormView gap="$5" paddingVertical={defaultPageVerticalPadding}>
      <Controller
        control={passportControl}
        name="passport"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <Input
            value={value}
            maxLength={64}
            label={form.passport.label}
            placeholder={form.passport.placeholder}
            error={error?.message}
            onChange={onChange}
            onBlur={passportHandleSubmit(onUpdateValue)}
          />
        )}
      />

      <Controller
        control={taxIdControl}
        name="taxId"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <Input
            value={value}
            maxLength={64}
            label={form.taxId.label}
            placeholder={form.taxId.placeholder}
            error={error?.message}
            onChange={onChange}
            onBlur={taxIdHandleSubmit(onUpdateValue)}
          />
        )}
      />
    </FormView>
  );
};
