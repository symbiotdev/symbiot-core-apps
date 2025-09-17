import {
  BrandEmployee, gendersWithoutEmptyOption,
  UpdateBrandEmployee,
  useBrandEmployeeGendersQuery,
  useModalUpdateForm,
  useUpdateBrandEmployeeQuery
} from '@symbiot-core-apps/api';
import {
  DatePicker,
  defaultPageVerticalPadding,
  FormView,
  Icon,
  Input,
  ListItem,
  SelectPicker,
  SlideSheetModal,
} from '@symbiot-core-apps/ui';
import { useBrandEmployeeForm } from '../hooks/use-brand-employee-form';
import { useLayoutEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useCurrentAccount } from '@symbiot-core-apps/state';
import { DateHelper } from '@symbiot-core-apps/shared';

type FormValue = {
  firstname: string;
  lastname: string;
  gender: string;
  birthday: string;
};

export const BrandEmployeePersonalInfo = ({
  employee,
}: {
  employee: BrandEmployee;
}) => {
  const { me } = useCurrentAccount();
  const { personalInfo } = useBrandEmployeeForm();
  const { value, modalVisible, openModal, closeModal, updateValue } =
    useModalUpdateForm<BrandEmployee, FormValue, UpdateBrandEmployee>({
      id: employee.id,
      query: useUpdateBrandEmployeeQuery,
      initialValue: {
        firstname: employee.firstname,
        lastname: employee.lastname,
        gender: employee.gender?.value,
        birthday: employee.birthday,
      },
    });

  return (
    <>
      <ListItem
        icon={<Icon name="UserCircle" />}
        iconAfter={<Icon name="ArrowRight" />}
        label={personalInfo.title}
        text={[
          `${value.firstname} ${value.lastname}`,
          value.birthday &&
            DateHelper.format(value.birthday, me?.preferences?.dateFormat),
          employee.gender?.label,
        ]
          .filter(Boolean)
          .join(' · ')}
        onPress={openModal}
      />

      <SlideSheetModal
        scrollable
        headerTitle={personalInfo.title}
        visible={modalVisible}
        onClose={closeModal}
      >
        <Form {...value} onUpdateValue={updateValue} />
      </SlideSheetModal>
    </>
  );
};

const Form = ({
  firstname,
  lastname,
  gender,
  birthday,
  onUpdateValue,
}: FormValue & {
  onUpdateValue: (value: Partial<FormValue>) => unknown;
}) => {
  const { me } = useCurrentAccount();
  const form = useBrandEmployeeForm();

  const {
    data: genders,
    isPending: gendersLoading,
    error: gendersError,
  } = useBrandEmployeeGendersQuery();

  const {
    control: firstnameControl,
    handleSubmit: firstnameHandleSubmit,
    setValue: setFirstnameValue,
  } = useForm<{
    firstname: string;
  }>({
    defaultValues: { firstname },
    resolver: yupResolver(
      yup
        .object()
        .shape({
          firstname: form.firstname.scheme,
        })
        .required(),
    ),
  });

  const {
    control: lastnameControl,
    handleSubmit: lastnameHandleSubmit,
    setValue: setLastnameValue,
  } = useForm<{
    lastname: string;
  }>({
    defaultValues: { lastname },
    resolver: yupResolver(
      yup
        .object()
        .shape({
          lastname: form.lastname.scheme,
        })
        .required(),
    ),
  });

  const {
    control: genderControl,
    handleSubmit: genderHandleSubmit,
    setValue: setGenderValue,
  } = useForm<{
    gender: string;
  }>({
    defaultValues: { gender },
    resolver: yupResolver(
      yup
        .object()
        .shape({
          gender: form.gender.scheme,
        })
        .required(),
    ),
  });

  const {
    control: birthdayControl,
    handleSubmit: birthdayHandleSubmit,
    setValue: setBirthdayValue,
  } = useForm<{
    birthday: string;
  }>({
    defaultValues: { birthday },
    resolver: yupResolver(
      yup
        .object()
        .shape({
          birthday: form.birthday.scheme,
        })
        .required(),
    ),
  });

  useLayoutEffect(() => {
    setFirstnameValue('firstname', firstname);
  }, [firstname, setFirstnameValue]);

  useLayoutEffect(() => {
    setLastnameValue('lastname', lastname);
  }, [lastname, setLastnameValue]);

  useLayoutEffect(() => {
    setGenderValue('gender', gender);
  }, [gender, setGenderValue]);

  useLayoutEffect(() => {
    setBirthdayValue('birthday', birthday);
  }, [birthday, setBirthdayValue]);

  return (
    <FormView gap="$5" paddingVertical={defaultPageVerticalPadding}>
      <Controller
        control={firstnameControl}
        name="firstname"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <Input
            value={value}
            maxLength={64}
            label={form.firstname.label}
            placeholder={form.firstname.placeholder}
            error={error?.message}
            onChange={onChange}
            onBlur={firstnameHandleSubmit(onUpdateValue)}
          />
        )}
      />

      <Controller
        control={lastnameControl}
        name="lastname"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <Input
            value={value}
            maxLength={64}
            label={form.lastname.label}
            placeholder={form.lastname.placeholder}
            error={error?.message}
            onChange={onChange}
            onBlur={lastnameHandleSubmit(onUpdateValue)}
          />
        )}
      />

      <Controller
        control={birthdayControl}
        name="birthday"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <DatePicker
            value={value}
            error={error?.message}
            formatStr={me?.preferences?.dateFormat}
            weekStartsOn={me?.preferences?.weekStartsOn}
            minDate={DateHelper.addYears(new Date(), -100)}
            maxDate={new Date()}
            label={form.birthday.label}
            placeholder={form.birthday.placeholder}
            onChange={(birthday) => {
              onChange(birthday);
              birthdayHandleSubmit(onUpdateValue)();
            }}
          />
        )}
      />

      <Controller
        control={genderControl}
        name="gender"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <SelectPicker
            label={form.gender.label}
            sheetLabel={form.gender.label}
            placeholder={form.gender.placeholder}
            options={gendersWithoutEmptyOption(genders)}
            optionsLoading={gendersLoading}
            optionsError={gendersError}
            value={value}
            error={error?.message}
            onChange={(gender) => {
              onChange(gender);
              genderHandleSubmit(onUpdateValue)();
            }}
          />
        )}
      />
    </FormView>
  );
};
