import {
  AvatarPicker,
  Card,
  defaultPageVerticalPadding,
  FormView,
  Icon,
  ListItem,
  ListItemGroup,
  PageView,
  SlideSheetModal,
  Switch,
} from '@symbiot-core-apps/ui';
import {
  BrandEmployee,
  BrandEmployeePermissions,
  Schedule,
  UpdateBrandEmployee as TUpdateBrandEmployee,
  useBrandEmployeePermissionsQuery,
  useModalUpdateByIdForm,
  useUpdateBrandEmployeeQuery,
} from '@symbiot-core-apps/api';
import React, { useCallback, useState } from 'react';
import { ImagePickerAsset } from 'expo-image-picker';
import { DateHelper } from '@symbiot-core-apps/shared';
import { useTranslation } from 'react-i18next';
import {
  useCurrentAccountState,
  useCurrentBrandState,
} from '@symbiot-core-apps/state';
import {
  DateFrom,
  MultiElementsForm,
  SingeElementForm,
  SingleElementToArrayForm,
} from '@symbiot-core-apps/form-controller';
import { BrandEmployeeFirstnameController } from './controller/brand-employee-firstname-controller';
import { BrandEmployeeLastnameController } from './controller/brand-employee-lastname-controller';
import { BrandEmployeeBirthdayController } from './controller/brand-employee-birthday-controller';
import { BrandEmployeeGenderController } from './controller/brand-employee-gender-controller';
import { BrandEmployeeRoleController } from './controller/brand-employee-role-controller';
import { BrandEmployeeProviderController } from './controller/brand-employee-provider-controller';
import { BrandEmployeeAboutController } from './controller/brand-employee-about-controller';
import { BrandEmployeeLocationController } from './controller/brand-employee-location-controller';
import { defaultEmployeeSchedule } from '../utils/schedule';
import { BrandEmployeeLocationScheduleController } from './controller/brand-employee-location-schedule-controller';
import { PhoneNumber } from 'react-native-phone-input/dist';
import { BrandEmployeePhoneController } from './controller/brand-employee-phone-controller';
import { BrandEmployeeEmailController } from './controller/brand-employee-email-controller';
import { BrandEmployeeAddressController } from './controller/brand-employee-address-controller';
import { BrandEmployeePassportController } from './controller/brand-employee-passport-controller';
import { BrandEmployeeTaxIdController } from './controller/brand-employee-tax-id-controller';
import { BrandEmployeePermissionsController } from './controller/brand-employee-permissions-controller';
import { useForm } from 'react-hook-form';
import { useDynamicBrandLocation } from '@symbiot-core-apps/brand';

export const UpdateBrandEmployee = ({
  employee,
}: {
  employee: BrandEmployee;
}) => {
  const { brand } = useCurrentBrandState();
  const { mutateAsync: updateAvatar, isPending: avatarUpdating } =
    useUpdateBrandEmployeeQuery();

  const onAddAvatar = useCallback(
    (avatar: ImagePickerAsset) =>
      updateAvatar({
        id: employee.id,
        data: {
          avatar,
        },
      }),
    [employee.id, updateAvatar],
  );

  return (
    <PageView scrollable withHeaderHeight withKeyboard gap="$5">
      <AvatarPicker
        marginHorizontal="auto"
        loading={avatarUpdating}
        name={employee.name}
        color={employee?.avatarColor}
        url={employee.avatarUrl}
        size={100}
        onAttach={onAddAvatar}
      />

      <FormView gap="$10" paddingVertical="$5">
        <ListItemGroup>
          <Personality employee={employee} />
          <Professionality employee={employee} />
          <About employee={employee} />
          <Location employee={employee} />
          <Contact employee={employee} />
          <Identification employee={employee} />

          {brand?.owner?.id !== employee.id && (
            <Permissions employee={employee} />
          )}
        </ListItemGroup>
      </FormView>
    </PageView>
  );
};

const Personality = ({ employee }: { employee: BrandEmployee }) => {
  const { me } = useCurrentAccountState();
  const { t } = useTranslation();
  const { value, modalVisible, openModal, closeModal, updateValue } =
    useModalUpdateByIdForm<
      BrandEmployee,
      {
        firstname: string;
        lastname: string;
        gender: string;
        birthday: string;
      },
      TUpdateBrandEmployee
    >({
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
        label={t('brand_employee.update.groups.personality.title')}
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
        headerTitle={t('brand_employee.update.groups.personality.title')}
        visible={modalVisible}
        onClose={closeModal}
      >
        <FormView gap="$5" paddingVertical={defaultPageVerticalPadding}>
          <SingeElementForm
            name="firstname"
            value={value.firstname}
            onUpdate={updateValue}
            Controller={BrandEmployeeFirstnameController}
          />
          <SingeElementForm
            name="lastname"
            value={value.lastname}
            onUpdate={updateValue}
            Controller={BrandEmployeeLastnameController}
          />
          <DateFrom
            name="birthday"
            value={value.birthday}
            onUpdate={updateValue}
            controllerProps={{
              disableDrag: true
            }}
            Controller={BrandEmployeeBirthdayController}
          />
          <SingeElementForm
            name="gender"
            value={value.gender}
            controllerProps={{
              disableDrag: true
            }}
            onUpdate={updateValue}
            Controller={BrandEmployeeGenderController}
          />
        </FormView>
      </SlideSheetModal>
    </>
  );
};

const Professionality = ({ employee }: { employee: BrandEmployee }) => {
  const { t } = useTranslation();
  const { value, modalVisible, openModal, closeModal, updateValue } =
    useModalUpdateByIdForm<
      BrandEmployee,
      {
        role: string;
        provider: boolean;
      },
      TUpdateBrandEmployee
    >({
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
        label={t('brand_employee.update.groups.professionality.title')}
        text={value.role}
        onPress={openModal}
      />

      <SlideSheetModal
        scrollable
        headerTitle={t('brand_employee.update.groups.professionality.title')}
        visible={modalVisible}
        onClose={closeModal}
      >
        <FormView paddingVertical={defaultPageVerticalPadding}>
          <SingeElementForm
            name="role"
            value={value.role}
            onUpdate={updateValue}
            Controller={BrandEmployeeRoleController}
          />
          <SingeElementForm
            name="provider"
            value={value.provider}
            onUpdate={updateValue}
            Controller={BrandEmployeeProviderController}
          />
        </FormView>
      </SlideSheetModal>
    </>
  );
};

const About = ({ employee }: { employee: BrandEmployee }) => {
  const { t } = useTranslation();
  const { value, modalVisible, openModal, closeModal, updateValue } =
    useModalUpdateByIdForm<
      BrandEmployee,
      {
        about: string;
      },
      TUpdateBrandEmployee
    >({
      id: employee.id,
      query: useUpdateBrandEmployeeQuery,
      initialValue: {
        about: employee.about,
      },
    });

  return (
    <>
      <ListItem
        icon={<Icon name="InfoCircle" />}
        iconAfter={<Icon name="ArrowRight" />}
        label={t('brand_employee.update.groups.about.title')}
        text={
          value.about?.replace(/\n/gi, ' ').replace(/\s\s/gi, '') ||
          t('shared.not_specified')
        }
        onPress={openModal}
      />

      <SlideSheetModal
        scrollable
        headerTitle={t('brand_employee.update.groups.about.title')}
        visible={modalVisible}
        onClose={closeModal}
      >
        <FormView paddingVertical={defaultPageVerticalPadding}>
          <SingeElementForm
            name="about"
            value={value.about}
            onUpdate={updateValue}
            Controller={BrandEmployeeAboutController}
          />
        </FormView>
      </SlideSheetModal>
    </>
  );
};

const Location = ({ employee }: { employee: BrandEmployee }) => {
  const { t } = useTranslation();
  const dynamicLocation = useDynamicBrandLocation();
  const { value, modalVisible, openModal, closeModal, updateValue } =
    useModalUpdateByIdForm<
      BrandEmployee,
      {
        locations: (string | null)[];
        schedules: Schedule[];
      },
      TUpdateBrandEmployee
    >({
      id: employee.id,
      query: useUpdateBrandEmployeeQuery,
      initialValue: {
        locations: employee.locations?.map(({ id }) => id) || [],
        schedules: employee.schedules || defaultEmployeeSchedule,
      },
    });

  const onChangeSchedule = useCallback(
    (checked: boolean) =>
      updateValue({
        schedules: !checked ? [] : defaultEmployeeSchedule,
      }),
    [updateValue],
  );

  return (
    <>
      <ListItem
        icon={<Icon name="MapPoint" />}
        iconAfter={<Icon name="ArrowRight" />}
        label={t('brand_employee.update.groups.location.title')}
        text={[
          employee.locations?.map(({ name }) => name).join(' · ') ||
            dynamicLocation.label,
          employee.schedules?.length
            ? employee.locations?.length
              ? t('brand_employee.form.location_custom_schedule.description')
              : t('brand_employee.form.employee_schedule.description')
            : '',
        ]
          .filter(Boolean)
          .join(' · ')}
        onPress={openModal}
      />

      <SlideSheetModal
        scrollable
        headerTitle={t('brand_employee.update.groups.location.title')}
        visible={modalVisible}
        onClose={closeModal}
      >
        <FormView paddingVertical={defaultPageVerticalPadding}>
          <SingleElementToArrayForm
            name="locations"
            value={
              value.locations.length ? value.locations : [dynamicLocation.value]
            }
            controllerProps={{
              disableDrag: true
            }}
            onUpdate={updateValue}
            Controller={BrandEmployeeLocationController}
          />

          <Card>
            <Switch
              label={t(
                value.locations.length
                  ? 'brand_employee.form.location_custom_schedule.label'
                  : 'brand_employee.form.employee_schedule.label',
              )}
              description={t(
                value.locations.length
                  ? 'brand_employee.form.location_custom_schedule.description'
                  : 'brand_employee.form.employee_schedule.description',
              )}
              checked={!!value.schedules.length}
              onChange={onChangeSchedule}
            />
          </Card>

          {!!value.schedules.length && (
            <MultiElementsForm
              name="schedules"
              value={value.schedules}
              controllerProps={{
                disableDrag: true
              }}
              onUpdate={updateValue}
              Controller={BrandEmployeeLocationScheduleController}
            />
          )}
        </FormView>
      </SlideSheetModal>
    </>
  );
};

const Contact = ({ employee }: { employee: BrandEmployee }) => {
  const { t } = useTranslation();
  const { value, modalVisible, openModal, closeModal, updateValue } =
    useModalUpdateByIdForm<
      BrandEmployee,
      {
        phones: string[];
        emails: string[];
        addresses: string[];
      },
      TUpdateBrandEmployee
    >({
      id: employee.id,
      query: useUpdateBrandEmployeeQuery,
      initialValue: {
        phones: employee.phones || [],
        emails: employee.emails || [],
        addresses: employee.addresses || [],
      },
    });

  return (
    <>
      <ListItem
        icon={<Icon name="ChatRoundDots" />}
        iconAfter={<Icon name="ArrowRight" />}
        label={t('brand_employee.update.groups.contact.title')}
        text={
          [
            value.phones
              .map((phone) =>
                PhoneNumber.format(
                  phone,
                  PhoneNumber.getCountryCodeOfNumber(phone),
                ),
              )
              .filter(Boolean)
              .join(', '),
            value.emails.join(', '),
            value.addresses.join(', '),
          ]
            .filter(Boolean)
            .join(' · ') || t('shared.not_specified')
        }
        onPress={openModal}
      />

      <SlideSheetModal
        scrollable
        headerTitle={t('brand_employee.update.groups.contact.title')}
        visible={modalVisible}
        onClose={closeModal}
      >
        <FormView paddingVertical={defaultPageVerticalPadding}>
          <SingleElementToArrayForm
            name="phones"
            value={value.phones}
            onUpdate={updateValue}
            Controller={BrandEmployeePhoneController}
          />
          <SingleElementToArrayForm
            name="emails"
            value={value.emails}
            onUpdate={updateValue}
            Controller={BrandEmployeeEmailController}
          />
          <SingleElementToArrayForm
            name="addresses"
            value={value.addresses}
            onUpdate={updateValue}
            Controller={BrandEmployeeAddressController}
          />
        </FormView>
      </SlideSheetModal>
    </>
  );
};

const Identification = ({ employee }: { employee: BrandEmployee }) => {
  const { t } = useTranslation();
  const { value, modalVisible, openModal, closeModal, updateValue } =
    useModalUpdateByIdForm<
      BrandEmployee,
      {
        passport: string;
        taxId: string;
      },
      TUpdateBrandEmployee
    >({
      id: employee.id,
      query: useUpdateBrandEmployeeQuery,
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
        label={t('brand_employee.update.groups.identification.title')}
        text={
          [value.passport, value.taxId].filter(Boolean).join(' · ') ||
          t('shared.not_specified')
        }
        onPress={openModal}
      />

      <SlideSheetModal
        scrollable
        headerTitle={t('brand_employee.update.groups.identification.title')}
        visible={modalVisible}
        onClose={closeModal}
      >
        <FormView paddingVertical={defaultPageVerticalPadding}>
          <SingeElementForm
            name="passport"
            value={value.passport}
            onUpdate={updateValue}
            Controller={BrandEmployeePassportController}
          />
          <SingeElementForm
            name="taxId"
            value={value.taxId}
            onUpdate={updateValue}
            Controller={BrandEmployeeTaxIdController}
          />
        </FormView>
      </SlideSheetModal>
    </>
  );
};

const Permissions = ({ employee }: { employee: BrandEmployee }) => {
  const { t } = useTranslation();
  const { data, error } = useBrandEmployeePermissionsQuery();
  const { value, modalVisible, openModal, closeModal, updateValue } =
    useModalUpdateByIdForm<
      BrandEmployee,
      {
        permissions: Partial<BrandEmployeePermissions>;
      },
      TUpdateBrandEmployee
    >({
      id: employee.id,
      query: useUpdateBrandEmployeeQuery,
      initialValue: {
        permissions: employee.permissions || {},
      },
    });

  const { control } = useForm<{
    permissions: BrandEmployeePermissions;
  }>({
    defaultValues: { permissions: value.permissions },
  });

  const [updatingKey, setUpdatingKey] =
    useState<keyof BrandEmployeePermissions>();

  const onChange = useCallback(
    async (key: keyof BrandEmployeePermissions, checked: boolean) => {
      setUpdatingKey(key);

      try {
        await updateValue({
          permissions: {
            [key]: checked,
          },
        });
      } finally {
        setUpdatingKey(undefined);
      }
    },
    [updateValue],
  );

  return (
    <>
      <ListItem
        icon={<Icon name="Lock" />}
        iconAfter={<Icon name="ArrowRight" />}
        label={t('brand_employee.update.groups.permissions.title')}
        text={
          !data && !error
            ? t('shared.syncing')
            : data
                ?.filter((permission) => value.permissions[permission.key])
                ?.map((permission) => t(permission.title))
                .join(' · ') || t('shared.not_specified')
        }
        onPress={openModal}
      />

      <SlideSheetModal
        scrollable
        headerTitle={t('brand_employee.update.groups.permissions.title')}
        visible={modalVisible}
        onClose={closeModal}
      >
        <FormView paddingVertical={defaultPageVerticalPadding}>
          <BrandEmployeePermissionsController
            loadingKey={updatingKey}
            control={control}
            onChange={onChange}
          />
        </FormView>
      </SlideSheetModal>
    </>
  );
};
