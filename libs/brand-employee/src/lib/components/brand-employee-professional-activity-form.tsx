import {
  BrandEmployee,
  UpdateBrandEmployee,
  useModalUpdateForm,
  useUpdateBrandEmployeeQuery,
} from '@symbiot-core-apps/api';
import { useBrandEmployeeForm } from '../hooks/use-brand-employee-form';
import { useEffect } from 'react';
import {
  Card,
  defaultPageVerticalPadding,
  FormView,
  Icon,
  Input,
  ListItem,
  SlideSheetModal,
  Switch,
} from '@symbiot-core-apps/ui';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

type FormValue = {
  provider: boolean;
  role: string;
};

export const BrandEmployeeProfessionalActivityForm = ({
  employee,
}: {
  employee: BrandEmployee;
}) => {
  const { professionalActivity } = useBrandEmployeeForm();
  const { value, modalVisible, openModal, closeModal, updateValue } =
    useModalUpdateForm<BrandEmployee, FormValue, UpdateBrandEmployee>({
      id: employee.id,
      query: useUpdateBrandEmployeeQuery,
      initialValue: {
        provider: employee.provider,
        role: employee.role,
      },
    });

  return (
    <>
      <ListItem
        icon={<Icon name="Tuning2" />}
        iconAfter={<Icon name="ArrowRight" />}
        label={professionalActivity.title}
        text={value.role}
        onPress={openModal}
      />

      <SlideSheetModal
        scrollable
        headerTitle={professionalActivity.title}
        visible={modalVisible}
        onClose={closeModal}
      >
        <Form {...value} onUpdateValue={updateValue} />
      </SlideSheetModal>
    </>
  );
};

const Form = ({
  provider,
  role,
  onUpdateValue,
}: FormValue & {
  onUpdateValue: (value: Partial<FormValue>) => unknown;
}) => {
  const form = useBrandEmployeeForm();

  const {
    control: roleControl,
    handleSubmit: roleHandleSubmit,
    setValue: setRoleValue,
  } = useForm<{
    role: string;
  }>({
    defaultValues: { role },
    resolver: yupResolver(
      yup
        .object()
        .shape({
          role: form.role.scheme,
        })
        .required(),
    ),
  });

  useEffect(() => {
    setRoleValue('role', role);
  }, [role, setRoleValue]);

  return (
    <FormView gap="$5" paddingVertical={defaultPageVerticalPadding}>
      <Controller
        control={roleControl}
        name="role"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <Input
            value={value}
            maxLength={64}
            label={form.role.label}
            placeholder={form.role.placeholder}
            error={error?.message}
            onChange={onChange}
            onBlur={roleHandleSubmit(onUpdateValue)}
          />
        )}
      />

      <Card>
        <Switch
          label={form.provider.label}
          description={form.provider.description}
          checked={provider}
          onChange={(checked) => onUpdateValue({ provider: checked })}
        />
      </Card>
    </FormView>
  );
};
