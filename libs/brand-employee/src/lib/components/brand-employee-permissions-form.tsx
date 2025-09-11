import {
  BrandEmployee,
  BrandEmployeePermission,
  BrandEmployeePermissions,
  UpdateBrandEmployee,
  useBrandEmployeePermissionsQuery,
  useModalUpdateForm,
  useUpdateBrandEmployeeQuery,
} from '@symbiot-core-apps/api';
import { useBrandEmployeeForm } from '../hooks/use-brand-employee-form';
import {
  Card,
  defaultPageVerticalPadding,
  FormView,
  Icon,
  InitView,
  ListItem,
  SlideSheetModal,
  Switch,
} from '@symbiot-core-apps/ui';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

type FormValue = {
  permissions: BrandEmployeePermissions;
};

export const BrandEmployeePermissionsForm = ({
  employee,
}: {
  employee: BrandEmployee;
}) => {
  const { t } = useTranslation();
  const form = useBrandEmployeeForm();
  const { value, modalVisible, openModal, closeModal, updateValue, updating } =
    useModalUpdateForm<BrandEmployee, FormValue, UpdateBrandEmployee>({
      id: employee.id,
      query: useUpdateBrandEmployeeQuery,
      initialValue: {
        permissions: employee.permissions,
      },
    });

  const {
    data: permissions,
    error: permissionsError,
    isPending,
  } = useBrandEmployeePermissionsQuery();

  return (
    <>
      <ListItem
        icon={<Icon name="Lock" />}
        iconAfter={<Icon name="ArrowRight" />}
        label={form.permissions.title}
        text={
          !permissions && !permissionsError
            ? t('shared.syncing')
            : permissions
                ?.filter((permission) => value.permissions[permission.key])
                ?.map((permission) => permission.title)
                .join(' · ') || t('shared.not_specified')
        }
        onPress={openModal}
      />

      <SlideSheetModal
        scrollable
        headerTitle={form.permissions.title}
        visible={modalVisible}
        onClose={closeModal}
      >
        <Form
          {...value}
          updating={updating}
          options={permissions}
          optionsLoading={isPending}
          optionsError={permissionsError}
          onUpdateValue={updateValue}
        />
      </SlideSheetModal>
    </>
  );
};

const Form = ({
  permissions,
  updating,
  options,
  optionsLoading,
  optionsError,
  onUpdateValue,
}: FormValue & {
  updating?: boolean;
  options?: BrandEmployeePermission[];
  optionsLoading?: boolean;
  optionsError?: string | null;
  onUpdateValue: (value: Partial<FormValue>) => Promise<void>;
}) => {
  const [updatingKey, setUpdatingKey] = useState<string>();

  return !options?.length ? (
    <InitView loading={optionsLoading} error={optionsError} />
  ) : (
    <FormView gap="$5" paddingVertical={defaultPageVerticalPadding}>
      {options.map((permission) => (
        <Card key={permission.key}>
          <Switch
            label={permission.title}
            disabled={updating}
            loading={updatingKey === permission.key}
            description={permission.subtitle}
            checked={permissions[permission.key]}
            onChange={async (checked) => {
              setUpdatingKey(permission.key);

              try {
                await onUpdateValue({
                  permissions: {
                    ...permissions,
                    [permission.key]: checked,
                  },
                });
              } finally {
                setUpdatingKey(undefined);
              }
            }}
          />
        </Card>
      ))}
    </FormView>
  );
};
