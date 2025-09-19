import {
  BrandService,
  UpdateBrandService,
  useBrandServiceFormatsQuery,
  useBrandServiceGendersQuery,
  useBrandServiceTypesQuery,
  useModalUpdateByIdForm,
  useUpdateBrandServiceQuery,
} from '@symbiot-core-apps/api';
import {
  defaultPageVerticalPadding,
  FormView,
  Icon,
  Input,
  ListItem,
  SelectPicker,
  SlideSheetModal,
} from '@symbiot-core-apps/ui';
import { useBrandServiceForm } from '../hooks/use-brand-service-form';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useLayoutEffect } from 'react';

type FormValue = {
  type: string;
  format: string;
  places: number;
  gender: string | null;
};

export const BrandServiceStructureForm = ({
  service,
}: {
  service: BrandService;
}) => {
  const { structure } = useBrandServiceForm();
  const { value, modalVisible, openModal, closeModal, updateValue } =
    useModalUpdateByIdForm<BrandService, FormValue, UpdateBrandService>({
      id: service.id,
      query: useUpdateBrandServiceQuery,
      initialValue: {
        type: service.type?.value,
        format: service.format?.value,
        places: service.places,
        gender: service.gender?.value,
      },
    });

  return (
    <>
      <ListItem
        icon={<Icon name="Tuning2" />}
        iconAfter={<Icon name="ArrowRight" />}
        label={structure.title}
        text={[
          service.type?.label,
          service.format
            ? `${service.format.label}${!service.format.fixed ? ` (${service.places})` : ''}`
            : '',
          service.gender?.value ? service.gender.label : '',
        ]
          .filter(Boolean)
          .join(' · ')}
        onPress={openModal}
      />

      <SlideSheetModal
        scrollable
        headerTitle={structure.title}
        visible={modalVisible}
        onClose={closeModal}
      >
        <Form {...value} onUpdateValue={updateValue} />
      </SlideSheetModal>
    </>
  );
};

const Form = ({
  type,
  format,
  places,
  gender,
  onUpdateValue,
}: FormValue & {
  onUpdateValue: (value: Partial<FormValue>) => unknown;
}) => {
  const form = useBrandServiceForm();
  const {
    data: types,
    isPending: typesLoading,
    error: typesError,
  } = useBrandServiceTypesQuery();
  const {
    data: formats,
    isPending: formatsLoading,
    error: formatsError,
  } = useBrandServiceFormatsQuery();
  const {
    data: genders,
    isPending: gendersLoading,
    error: gendersError,
  } = useBrandServiceGendersQuery();

  const {
    control: typeControl,
    handleSubmit: typeHandleSubmit,
    setValue: setTypeValue,
  } = useForm<{
    type: string;
  }>({
    defaultValues: { type },
    resolver: yupResolver(
      yup
        .object()
        .shape({
          type: form.type.scheme,
        })
        .required(),
    ),
  });

  const {
    control: formatControl,
    handleSubmit: formatHandleSubmit,
    setValue: setFormatValue,
  } = useForm<{
    format: string;
  }>({
    defaultValues: { format },
    resolver: yupResolver(
      yup
        .object()
        .shape({
          format: form.format.scheme,
        })
        .required(),
    ),
  });

  const {
    control: placesControl,
    handleSubmit: placesHandleSubmit,
    setValue: setPlacesValue,
  } = useForm<{
    places: number;
  }>({
    defaultValues: { places },
    resolver: yupResolver(
      yup
        .object()
        .shape({
          places: form.places.scheme,
        })
        .required(),
    ),
  });

  const {
    control: genderControl,
    handleSubmit: genderHandleSubmit,
    setValue: setGenderValue,
  } = useForm<{
    gender: string | null;
  }>({
    defaultValues: { gender },
    resolver: yupResolver(
      yup
        .object()
        .shape({
          gender: form.gender.scheme.default(null),
        })
        .required(),
    ),
  });

  useLayoutEffect(() => {
    setTypeValue('type', type);
  }, [type, setTypeValue]);

  useLayoutEffect(() => {
    setFormatValue('format', format);
  }, [format, setFormatValue]);

  useLayoutEffect(() => {
    setPlacesValue('places', Math.max(2, places));
  }, [places, setPlacesValue]);

  useLayoutEffect(() => {
    setGenderValue('gender', gender);
  }, [gender, setGenderValue]);

  return (
    <FormView gap="$5" paddingVertical={defaultPageVerticalPadding}>
      <Controller
        control={typeControl}
        name="type"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <SelectPicker
            label={form.type.label}
            sheetLabel={form.type.label}
            placeholder={form.type.placeholder}
            options={types}
            optionsLoading={typesLoading}
            optionsError={typesError}
            value={value}
            error={error?.message}
            onChange={(type) => {
              onChange(type);
              typeHandleSubmit(onUpdateValue)();
            }}
          />
        )}
      />

      <Controller
        control={formatControl}
        name="format"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <SelectPicker
            label={form.format.label}
            sheetLabel={form.format.label}
            placeholder={form.format.placeholder}
            options={formats}
            optionsLoading={formatsLoading}
            optionsError={formatsError}
            value={value}
            error={error?.message}
            onChange={(format) => {
              onChange(format);
              formatHandleSubmit(onUpdateValue)();
            }}
          />
        )}
      />
      {formats?.find(({ value }) => format === value)?.fixed === false && (
        <Controller
          control={placesControl}
          name="places"
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <Input
              type="numeric"
              keyboardType="numeric"
              value={value}
              maxLength={64}
              regex={/\d+/}
              label={form.places.label}
              placeholder={form.places.placeholder}
              error={error?.message}
              onChange={onChange}
              onBlur={placesHandleSubmit(onUpdateValue)}
            />
          )}
        />
      )}

      <Controller
        control={genderControl}
        name="gender"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <SelectPicker
            label={form.gender.label}
            sheetLabel={form.gender.label}
            placeholder={form.gender.placeholder}
            options={genders}
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
