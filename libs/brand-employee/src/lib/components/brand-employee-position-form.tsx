import {
  BrandEmployee,
  BrandIndustryServiceType,
  useBrandIndustryServiceTypeQuery,
  useUpdateBrandEmployeeQuery,
} from '@symbiot-core-apps/api';
import { useBrandEmployeeForm } from '../hooks/use-brand-employee-form';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Card,
  defaultPageHorizontalPadding,
  defaultPageVerticalPadding,
  FormView,
  Icon,
  Input,
  ListItem,
  SlideSheetModal,
  Switch,
  ToggleGroup,
} from '@symbiot-core-apps/ui';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useUpdateBrandEmployeeForm } from '../hooks/use-update-brand-employee-form';
import { arraysOfObjectsEqual } from '@symbiot-core-apps/shared';

type FormValue = {
  provider: boolean;
  position: string;
};

export const BrandEmployeePositionForm = ({
  employee,
}: {
  employee: BrandEmployee;
}) => {
  const { positionInfo } = useBrandEmployeeForm();
  const { mutateAsync: update } = useUpdateBrandEmployeeQuery();
  const { value, modalVisible, openModal, closeModal, updateValue } =
    useUpdateBrandEmployeeForm<FormValue>({
      id: employee.id,
      initialValue: {
        provider: employee.provider,
        position: employee.position,
      },
    });

  const [serviceTypes, setServiceTypes] = useState<BrandIndustryServiceType[]>(
    employee.serviceTypes,
  );

  const updateServiceTypes = useCallback(
    async (newServiceTypes: BrandIndustryServiceType[]) => {
      if (arraysOfObjectsEqual(employee.serviceTypes, newServiceTypes)) return;

      setServiceTypes(newServiceTypes);

      try {
        await update({
          id: employee.id,
          data: {
            serviceTypes: newServiceTypes.map(({ id }) => id),
          },
        });
      } catch {
        setServiceTypes(employee.serviceTypes);
        setTimeout(openModal, 500);
      }
    },
    [employee.id, employee.serviceTypes, openModal, update],
  );

  return (
    <>
      <ListItem
        icon={<Icon name="Tuning2" />}
        iconAfter={<Icon name="ArrowRight" />}
        label={positionInfo.title}
        text={[value.position, ...(serviceTypes.map(({ name }) => name) || '')]
          .filter(Boolean)
          .join(' · ')}
        onPress={openModal}
      />

      <SlideSheetModal
        scrollable
        headerTitle={positionInfo.title}
        visible={modalVisible}
        onClose={closeModal}
      >
        <Form
          {...value}
          initialServiceTypes={serviceTypes}
          onUpdateValue={updateValue}
          onUpdateServiceTypes={updateServiceTypes}
        />
      </SlideSheetModal>
    </>
  );
};

const Form = ({
  provider,
  position,
  initialServiceTypes,
  onUpdateValue,
  onUpdateServiceTypes,
}: FormValue & {
  initialServiceTypes: BrandIndustryServiceType[];
  onUpdateValue: (value: Partial<FormValue>) => unknown;
  onUpdateServiceTypes: (serviceTypes: BrandIndustryServiceType[]) => unknown;
}) => {
  const form = useBrandEmployeeForm();
  const {
    data: serviceTypesData,
    isPending: serviceTypesLoading,
    error: serviceTypesError,
  } = useBrandIndustryServiceTypeQuery();

  const serviceTypesRef = useRef(initialServiceTypes);

  const [serviceTypes, setServiceTypes] =
    useState<BrandIndustryServiceType[]>(initialServiceTypes);

  const {
    control: positionControl,
    handleSubmit: positionHandleSubmit,
    setValue: setPositionValue,
  } = useForm<{
    position: string;
  }>({
    defaultValues: { position },
    resolver: yupResolver(
      yup
        .object()
        .shape({
          position: form.position.scheme,
        })
        .required(),
    ),
  });

  const serviceTypeAsToggleOptions = useMemo(
    () =>
      serviceTypesData?.map((serviceType) => ({
        label: serviceType.name,
        value: serviceType,
      })),
    [serviceTypesData],
  );

  useEffect(() => {
    setPositionValue('position', position);
  }, [position, setPositionValue]);

  useEffect(() => {
    return () => {
      const serviceTypes = serviceTypesRef.current;

      onUpdateServiceTypes(serviceTypes);
    };
  }, [onUpdateServiceTypes]);

  return (
    <FormView gap="$5" paddingVertical={defaultPageVerticalPadding}>
      <Card>
        <Switch
          label={form.provider.label}
          checked={provider}
          onChange={(checked) => onUpdateValue({ provider: checked })}
        />
      </Card>

      <Controller
        control={positionControl}
        name="position"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <Input
            value={value}
            maxLength={64}
            label={form.position.label}
            placeholder={form.position.placeholder}
            error={error?.message}
            onChange={onChange}
            onBlur={positionHandleSubmit(onUpdateValue)}
          />
        )}
      />

      <ToggleGroup
        allowEmpty
        viewProps={{
          backgroundColor: '$background1',
          borderRadius: '$10',
          paddingHorizontal: defaultPageHorizontalPadding,
        }}
        multiselect
        label={form.serviceTypes.label}
        items={serviceTypeAsToggleOptions}
        loading={serviceTypesLoading}
        value={serviceTypes}
        error={serviceTypesError}
        onChange={(value) => {
          serviceTypesRef.current = value as BrandIndustryServiceType[];
          setServiceTypes(serviceTypesRef.current);
        }}
      />
    </FormView>
  );
};
