import {
  BrandClient,
  Phone,
  UpdateBrandClient,
  useModalUpdateForm,
  useUpdateBrandClientQuery,
} from '@symbiot-core-apps/api';
import { useTranslation } from 'react-i18next';
import {
  defaultPageVerticalPadding,
  FormView,
  Icon,
  Input,
  ListItem,
  PhoneInput,
  SlideSheetModal,
} from '@symbiot-core-apps/ui';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useLayoutEffect } from 'react';
import { useBrandClientForm } from '../hooks/use-brand-client-form';

type FormValue = {
  phone: Phone;
  email: string;
  address: string;
};

export const BrandClientContactInfo = ({ client }: { client: BrandClient }) => {
  const { t } = useTranslation();
  const form = useBrandClientForm();
  const { value, modalVisible, updateValue, openModal, closeModal } =
    useModalUpdateForm<BrandClient, FormValue, UpdateBrandClient>({
      id: client.id,
      query: useUpdateBrandClientQuery,
      initialValue: {
        phone: client.phones[0],
        email: client.email,
        address: client.address,
      },
      dataRequestFormatted: (requestValue) => {
        if (requestValue.phone) {
          return {
            ...requestValue,
            phone: undefined,
            phones: requestValue.phone.tel ? [requestValue.phone] : [],
          };
        }

        return requestValue;
      },
    });

  return (
    <>
      <ListItem
        icon={<Icon name="ChatRoundDots" />}
        iconAfter={<Icon name="ArrowRight" />}
        label={form.contactInfo.title}
        text={
          [
            value.phone.formatted,
            value.email,
            value.address,
          ]
            .filter(Boolean)
            .join(' · ') || t('shared.not_specified')
        }
        onPress={openModal}
      />

      <SlideSheetModal
        scrollable
        headerTitle={form.contactInfo.title}
        visible={modalVisible}
        onClose={closeModal}
      >
        <Form {...value} onUpdateValue={updateValue} />
      </SlideSheetModal>
    </>
  );
};

const Form = ({
  phone,
  address,
  email,
  onUpdateValue,
}: FormValue & {
  onUpdateValue: (value: Partial<FormValue>) => unknown;
}) => {
  const form = useBrandClientForm();

  const {
    control: phoneControl,
    handleSubmit: phoneHandleSubmit,
    setValue: setPhoneValue,
  } = useForm<{
    phone: Phone;
  }>({
    defaultValues: { phone },
    resolver: yupResolver(
      yup
        .object()
        .shape({
          phone: form.phone.scheme,
        })
        .required(),
    ),
  });

  const {
    control: emailControl,
    handleSubmit: emailHandleSubmit,
    setValue: setEmailValue,
  } = useForm<{
    email: string;
  }>({
    defaultValues: { email },
    resolver: yupResolver(
      yup
        .object()
        .shape({
          email: form.email.scheme,
        })
        .required(),
    ),
  });

  const {
    control: addressControl,
    handleSubmit: addressHandleSubmit,
    setValue: setAddressValue,
  } = useForm<{
    address: string;
  }>({
    defaultValues: { address },
    resolver: yupResolver(
      yup
        .object()
        .shape({
          address: form.address.scheme,
        })
        .required(),
    ),
  });

  useLayoutEffect(() => {
    setPhoneValue('phone', phone);
  }, [phone, setPhoneValue]);

  useLayoutEffect(() => {
    setEmailValue('email', email);
  }, [email, setEmailValue]);

  useLayoutEffect(() => {
    setAddressValue('address', address);
  }, [address, setAddressValue]);

  return (
    <FormView gap="$5" paddingVertical={defaultPageVerticalPadding}>
      <Controller
        control={phoneControl}
        name="phone"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <PhoneInput
            enterKeyHint="done"
            value={value}
            label={form.phone.label}
            placeholder={form.phone.placeholder}
            error={error?.message}
            onChange={onChange}
            onBlur={phoneHandleSubmit(onUpdateValue)}
          />
        )}
      />

      <Controller
        control={emailControl}
        name="email"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <Input
            value={value}
            error={error?.message}
            enterKeyHint="done"
            type="email"
            keyboardType="email-address"
            label={form.email.label}
            placeholder={form.email.placeholder}
            onChange={onChange}
            onBlur={emailHandleSubmit(onUpdateValue)}
          />
        )}
      />

      <Controller
        control={addressControl}
        name="address"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <Input
            value={value}
            error={error?.message}
            enterKeyHint="done"
            label={form.address.label}
            placeholder={form.address.placeholder}
            onChange={onChange}
            onBlur={addressHandleSubmit(onUpdateValue)}
          />
        )}
      />
    </FormView>
  );
};
