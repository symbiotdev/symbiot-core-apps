import {
  Button,
  EmptyView,
  Icon,
  Input,
  MediumText,
  PageView,
  PhoneValue,
  QrCodeScanModal,
  WeekdaySchedule,
} from '@symbiot-core-apps/ui';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'tamagui';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Account,
  BrandEmployeePermission,
  BrandEmployeePermissions,
  BrandIndustryServiceType,
  useBrandEmployeeNewAccountQuery,
  useBrandEmployeePermissionsQuery,
  useBrandIndustryServiceTypeQuery,
  useCreateBrandEmployeeQuery,
  useCurrentBrandLocationsQuery,
} from '@symbiot-core-apps/api';
import { useBrandEmployeeForm } from '@symbiot-core-apps/brand-employee';
import { Survey, SurveyStep } from '@symbiot-core-apps/survey';
import { useCurrentBrandState, useGenders } from '@symbiot-core-apps/state';
import { ImagePickerAsset } from 'expo-image-picker';
import { useDynamicBrandLocation } from '@symbiot-core-apps/brand-location';
import { router } from 'expo-router';

type Value = {
  firstname: string;
  lastname: string;
  position: string;
  email: string;
  address: string;
  passport: string;
  taxId: string;
  about: string;
  location: string;
  permissions: BrandEmployeePermissions;
  birthday: string;
  phone: PhoneValue;
  customSchedule: boolean;
  provider: boolean;
  genderId: string;
  schedule: WeekdaySchedule[];
  avatar: ImagePickerAsset;
  serviceTypes: BrandIndustryServiceType[];
};

const TypedSurvey = Survey<Value>;

export default () => {
  const { brand: currentBrand } = useCurrentBrandState();
  const { data: permissions } = useBrandEmployeePermissionsQuery();
  const {
    data: locations,
    isPending: locationsLoading,
    error: locationsError,
  } = useCurrentBrandLocationsQuery();
  const {
    data: serviceTypes,
    isPending: serviceTypesLoading,
    error: serviceTypesError,
  } = useBrandIndustryServiceTypeQuery();
  const {
    gendersAsOptions,
    loading: gendersLoading,
    error: gendersError,
  } = useGenders();
  const { mutateAsync: createEmployee } = useCreateBrandEmployeeQuery();
  const form = useBrandEmployeeForm();
  const dynamicLocation = useDynamicBrandLocation();

  const createdRef = useRef(false);
  const [processing, setProcessing] = useState(false);

  const [account, setAccount] = useState<Account | undefined>(undefined);

  const locationsAsOptions = useMemo(
    () =>
      locations?.items && [
        dynamicLocation,
        ...locations.items.map((location) => ({
          label: location.name,
          description: location.address,
          value: location.id,
        })),
      ],
    [dynamicLocation, locations],
  );

  const serviceTypeAsToggleOptions = useMemo(
    () =>
      serviceTypes?.map((serviceType) => ({
        label: serviceType.name,
        value: serviceType,
      })),
    [serviceTypes],
  );

  const steps: SurveyStep<Value>[] = useMemo(
    () => [
      {
        id: 'personality',
        nextId: 'avatar',
        title: form.personalInfo.title,
        subtitle: form.personalInfo.subtitle,
        elements: [
          {
            type: 'input',
            props: {
              ...form.firstname,
              name: 'firstname',
              enterKeyHint: 'next',
              defaultValue: account?.firstname,
            },
          },
          {
            type: 'input',
            props: {
              ...form.lastname,
              name: 'lastname',
              enterKeyHint: 'next',
              defaultValue: account?.lastname,
            },
          },
          {
            type: 'select-picker',
            props: {
              ...form.gender,
              options: gendersAsOptions,
              optionsLoading: gendersLoading,
              optionsError: gendersError,
              name: 'genderId',
            },
          },
          {
            type: 'date-picker',
            props: {
              ...form.birthday,
              name: 'birthday',
              defaultValue: account?.birthday,
            },
          },
          {
            type: 'input',
            props: {
              ...form.passport,
              name: 'passport',
              enterKeyHint: 'next',
            },
          },
          {
            type: 'input',
            props: {
              ...form.taxId,
              name: 'taxId',
              enterKeyHint: 'done',
            },
          },
        ],
      },
      {
        id: 'avatar',
        nextId: 'contact-info',
        title: form.avatar.title,
        subtitle: form.avatar.subtitle,
        skippable: true,
        elements: [
          {
            type: 'avatar',
            props: {
              ...form.avatar,
              name: 'avatar',
              defaultValue: account?.avatarXsUrl,
              stepValueKey: 'firstname',
            },
          },
        ],
      },
      {
        id: 'contact-info',
        nextId: 'location',
        title: form.contactInfo.title,
        subtitle: form.contactInfo.subtitle,
        elements: [
          {
            type: 'phone',
            props: {
              ...form.phone,
              name: 'phone',
              enterKeyHint: 'done',
              defaultValue: account?.phones?.[0] || form.phone.defaultValue,
            },
          },
          {
            type: 'email',
            props: {
              ...form.email,
              name: 'email',
              enterKeyHint: 'done',
            },
          },
          {
            type: 'input',
            props: {
              ...form.address,
              name: 'address',
              enterKeyHint: 'done',
            },
          },
        ],
      },
      {
        id: 'location',
        nextId: 'position',
        title: form.location.title,
        subtitle: form.location.subtitle,
        elements: [
          {
            type: 'select-picker',
            props: {
              ...form.location,
              name: 'location',
              options: locationsAsOptions,
              optionsLoading: locationsLoading,
              optionsError: locationsError,
              defaultValue: null,
              label: '',
            },
          },
          {
            type: 'switch',
            props: {
              ...form.customSchedule,
              name: 'customSchedule',
              showWhen: (value) => !!value.location,
            },
          },
          {
            type: 'weekdays-schedule',
            props: {
              ...form.schedule,
              name: 'schedule',
              showWhen: (value) => {
                console.log('v', value);

                return !value.location || value.customSchedule;
              },
            },
          },
        ],
      },
      {
        id: 'position',
        nextId: 'permissions',
        title: form.positionInfo.title,
        subtitle: form.positionInfo.subtitle,
        elements: [
          {
            type: 'switch',
            props: {
              ...form.provider,
              name: 'provider',
            },
          },
          {
            type: 'input',
            props: {
              ...form.position,
              name: 'position',
              defaultValue: '',
            },
          },
          {
            type: 'toggle-group',
            props: {
              ...form.serviceType,
              name: 'serviceTypes',
              showWhen: (value) => value.provider,
              options: serviceTypeAsToggleOptions,
              optionsLoading: serviceTypesLoading,
              optionsError: serviceTypesError,
              defaultValue: [],
            },
          },
        ],
      },
      {
        id: 'permissions',
        nextId: 'about',
        title: form.permissions.title,
        subtitle: form.permissions.subtitle,
        elements: (permissions as BrandEmployeePermission[])?.map(
          (permission) => ({
            type: 'switch',
            props: {
              name: `permissions.${permission.key}`,
              label: permission.title,
              description: permission.subtitle,
              scheme: yup.boolean().nullable(),
            },
          }),
        ),
      },
      {
        id: 'about',
        nextId: null,
        title: form.about.title,
        subtitle: form.about.subtitle,
        skippable: true,
        elements: [
          {
            type: 'textarea',
            props: {
              ...form.about,
              label: '',
              name: 'about',
              enterKeyHint: 'done',
            },
          },
        ],
      },
    ],
    [
      form,
      account,
      currentBrand,
      permissions,
      locations?.items?.length,
      gendersAsOptions,
      gendersLoading,
      gendersError,
      locationsAsOptions,
      locationsLoading,
      locationsError,
      serviceTypeAsToggleOptions,
      serviceTypesLoading,
      serviceTypesError,
    ],
  );

  const onFinish = useCallback(
    async (value: Value) => {
      if (!account?.id) return;

      setProcessing(true);

      try {
        await createEmployee({
          id: account.id,
          data: {
            firstname: value.firstname,
            lastname: value.lastname,
            email: value.email,
            address: value.address,
            passport: value.passport,
            taxId: value.taxId,
            birthday: value.birthday ? String(value.birthday) : null,
            genderId: value.genderId,
            avatar: value.avatar,
            provider: value.provider,
            about: value.about,
            position: value.position,
            permissions: value.permissions,
            phones: value.phone ? [value.phone] : [],
            schedules: value.customSchedule
              ? value.schedule.map((schedule) => ({
                  ...schedule,
                  locationId: value.location,
                }))
              : [],
            serviceTypes: value.serviceTypes?.length
              ? value.serviceTypes.map(({ id }) => id)
              : [],
          },
        });

        createdRef.current = true;

        router.dismissTo('/brand/menu/employees');
      } finally {
        setProcessing(false);
      }
    },
    [account?.id],
  );

  return !account ? (
    <Intro onStart={setAccount} />
  ) : (
    <TypedSurvey
      steps={steps}
      loading={processing}
      ignoreLeaveConfirmation={createdRef.current}
      onFinish={onFinish}
    />
  );
};

const Intro = ({ onStart }: { onStart: (account: Account) => void }) => {
  const { t } = useTranslation();
  const { mutateAsync: getNewEmployeeAccountById, isPending: isPendingById } =
    useBrandEmployeeNewAccountQuery();
  const { mutateAsync: getNewEmployeeAccountByQR, isPending: isPendingByQR } =
    useBrandEmployeeNewAccountQuery();

  const { control, handleSubmit } = useForm<{
    id: string;
  }>({
    defaultValues: {
      id: 'qa2Dp72G',
    },
    resolver: yupResolver(
      yup
        .object()
        .shape({
          id: yup
            .string()
            .required(
              t('brand.employees.upsert.intro.by_id.form.id.error.required'),
            ),
        })
        .required(),
    ),
  });

  const [scanQrVisible, setScanQrVisible] = useState<boolean>(false);

  const openScanQr = useCallback(() => setScanQrVisible(true), []);
  const closeScanQr = useCallback(() => setScanQrVisible(false), []);

  const onScannedQr = useCallback(
    async (id: string) => onStart(await getNewEmployeeAccountByQR({ id })),
    [onStart, getNewEmployeeAccountByQR],
  );

  const onAdd = useCallback(
    async ({ id }: { id: string }) =>
      onStart(await getNewEmployeeAccountById({ id })),
    [onStart, getNewEmployeeAccountById],
  );

  return (
    <>
      <PageView
        scrollable
        withKeyboard
        withHeaderHeight
        animation="medium"
        opacity={1}
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      >
        <EmptyView
          padding={0}
          iconName="UsersGroupRounded"
          title={t('brand.employees.upsert.intro.title')}
          message={t('brand.employees.upsert.intro.subtitle')}
        >
          <View />

          <Controller
            control={control}
            name="id"
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <Input
                value={value}
                disabled={isPendingById || isPendingByQR}
                error={error?.message}
                label={t('brand.employees.upsert.intro.by_id.form.id.label')}
                placeholder={t(
                  'brand.employees.upsert.intro.by_id.form.id.placeholder',
                )}
                onChange={onChange}
              />
            )}
          />

          <Button
            loading={isPendingById}
            disabled={isPendingById || isPendingByQR}
            label={t('brand.employees.upsert.intro.by_id.action.label')}
            onPress={handleSubmit(onAdd)}
          />

          <MediumText>{t('shared.or')}</MediumText>

          <Button
            loading={isPendingByQR}
            disabled={isPendingById || isPendingByQR}
            icon={<Icon name="QrCode" />}
            label={t('brand.employees.upsert.intro.qr.action.label')}
            onPress={openScanQr}
          />
        </EmptyView>
      </PageView>

      <QrCodeScanModal
        onScan={onScannedQr}
        visible={scanQrVisible}
        onClose={closeScanQr}
      />
    </>
  );
};
