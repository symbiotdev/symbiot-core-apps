import { AvatarPicker, Survey, SurveyStep } from '@symbiot-core-apps/ui';
import {
  Account,
  BrandEmployeePermissions,
  Schedule,
  useBrandEmployeeNewAccountQuery,
  useCreateBrandEmployeeQuery,
} from '@symbiot-core-apps/api';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useTranslation } from 'react-i18next';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { EventArg, NavigationAction } from '@react-navigation/native';
import { ConfirmAlert } from '@symbiot-core-apps/shared';
import { useForm } from 'react-hook-form';
import { BrandEmployeeFirstnameController } from './controller/brand-employee-firstname-controller';
import { BrandEmployeeLastnameController } from './controller/brand-employee-lastname-controller';
import { BrandEmployeeGenderController } from './controller/brand-employee-gender-controller';
import { BrandEmployeeBirthdayController } from './controller/brand-employee-birthday-controller';
import { BrandEmployeeTaxIdController } from './controller/brand-employee-tax-id-controller';
import { BrandEmployeePassportController } from './controller/brand-employee-passport-controller';
import { ImagePickerAsset } from 'expo-image-picker';
import { BrandEmployeeAddressController } from './controller/brand-employee-address-controller';
import { BrandEmployeePhoneController } from './controller/brand-employee-phone-controller';
import { BrandEmployeeEmailController } from './controller/brand-employee-email-controller';
import { BrandEmployeeLocationController } from './controller/brand-employee-location-controller';
import { BrandEmployeeLocationCustomScheduleController } from './controller/brand-employee-location-custom-schedule-controller';
import { BrandEmployeeLocationScheduleController } from './controller/brand-employee-location-schedule-controller';
import { BrandEmployeeScheduleController } from './controller/brand-employee-schedule-controller';
import { BrandEmployeeRoleController } from './controller/brand-employee-role-controller';
import { BrandEmployeeProviderController } from './controller/brand-employee-provider-controller';
import { BrandEmployeePermissionsController } from './controller/brand-employee-permissions-controller';
import { BrandEmployeeAboutController } from './controller/brand-employee-about-controller';

export const CreateBrandEmployee = () => {
  const { t } = useTranslation();
  const { mutateAsync: createEmployee, isPending } =
    useCreateBrandEmployeeQuery();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { mutateAsync: getAccountById } = useBrandEmployeeNewAccountQuery();
  const navigation = useNavigation();

  const createdRef = useRef(false);

  const [account, setAccount] = useState<Account | undefined>(undefined);
  const [avatar, setAvatar] = useState<ImagePickerAsset>();

  const {
    control: personalityControl,
    getValues: personalityGetValues,
    formState: personalityFormState,
    setValue: personalitySetValue,
    watch: personalityWatch,
  } = useForm<{
    firstname: string;
    lastname: string;
    gender: string;
    passport: string;
    taxId: string;
    birthday: string | null;
  }>({
    defaultValues: {
      firstname: '',
      lastname: '',
      gender: '',
      passport: '',
      taxId: '',
      birthday: null,
    },
  });

  const {
    control: contactControl,
    getValues: contactGetValues,
    formState: contactFormState,
  } = useForm<{
    phone: string;
    email: string;
    address: string;
  }>({
    defaultValues: {
      phone: '',
      email: '',
      address: '',
    },
  });

  const {
    control: locationControl,
    getValues: locationGetValues,
    formState: locationFormState,
    watch: locationWatch,
  } = useForm<{
    location: string | null;
    customSchedule: boolean;
    schedule: Schedule[];
  }>({
    defaultValues: {
      location: null,
      customSchedule: false,
      schedule: [
        ...Array.from({ length: 5 }).map((_, index) => ({
          day: index + 1,
          start: 540,
          end: 1080,
        })),
        {
          day: 0,
          start: 0,
          end: 0,
        },
        {
          day: 6,
          start: 0,
          end: 0,
        },
      ],
    },
  });

  const {
    control: professionalityControl,
    getValues: professionalityGetValues,
    formState: professionalityFormState,
  } = useForm<{
    role: string;
    provider: boolean;
  }>({
    defaultValues: {
      role: '',
      provider: true,
    },
  });

  const {
    control: permissionsControl,
    getValues: permissionsGetValues,
    formState: permissionsFormState,
  } = useForm<{ permissions: BrandEmployeePermissions }>({
    defaultValues: { permissions: {} },
  });

  const {
    control: aboutControl,
    getValues: aboutGetValues,
    formState: aboutFormState,
  } = useForm<{
    about: string;
  }>({
    defaultValues: {
      about: '',
    },
  });

  const onFinish = useCallback(async () => {
    if (!account?.id) return;

    const { firstname, lastname, gender, birthday, taxId, passport } =
      personalityGetValues();
    const { phone, email, address } = contactGetValues();
    const { location, customSchedule, schedule } = locationGetValues();
    const { role, provider } = professionalityGetValues();
    const { permissions } = permissionsGetValues();
    const { about } = aboutGetValues();

    await createEmployee({
      id: account.id,
      data: {
        avatar,
        firstname,
        lastname,
        gender,
        taxId,
        passport,
        role,
        provider,
        permissions,
        about,
        birthday: birthday ? String(birthday) : null,
        phones: phone ? [phone] : [],
        emails: email ? [email] : [],
        addresses: address ? [address] : [],
        locations: location ? [location] : [],
        schedules:
          customSchedule || !location
            ? schedule.map((schedule) => ({
                ...schedule,
                location,
              }))
            : [],
      },
    });

    createdRef.current = true;

    router.dismissTo('/employees');
  }, [
    account?.id,
    avatar,
    aboutGetValues,
    contactGetValues,
    createEmployee,
    locationGetValues,
    permissionsGetValues,
    personalityGetValues,
    professionalityGetValues,
  ]);

  const onLeave = useCallback(
    (e: EventArg<'beforeRemove', true, { action: NavigationAction }>) => {
      if (createdRef.current) return;

      e.preventDefault();

      ConfirmAlert({
        title: t('brand_employee.create.discard.title'),
        message: t('brand_employee.create.discard.message'),
        callback: () => navigation.dispatch(e.data.action),
      });
    },
    [t, navigation],
  );

  useEffect(() => {
    navigation.setOptions({
      gestureEnabled: false,
      headerShown: !isPending,
    });
  }, [isPending, navigation]);

  useEffect(() => {
    navigation.addListener('beforeRemove', onLeave);

    return () => {
      navigation.removeListener('beforeRemove', onLeave);
    };
  }, [onLeave, navigation]);

  useEffect(() => {
    getAccountById({ id })
      .then((account) => {
        setAccount(account);
        personalitySetValue('firstname', account.firstname);
        personalitySetValue('lastname', account.lastname);
        personalitySetValue('gender', account.gender?.value);
        personalitySetValue('birthday', account.birthday);
      })
      .catch(router.back);
  }, [getAccountById, id, personalitySetValue]);

  const { firstname, lastname } = personalityWatch();
  const { location, customSchedule } = locationWatch();

  return (
    <Survey
      loading={isPending || createdRef.current || !account}
      onFinish={onFinish}
    >
      <SurveyStep
        canGoNext={personalityFormState.isValid}
        title={t('brand_employee.create.steps.personality.title')}
        subtitle={t('brand_employee.create.steps.personality.subtitle')}
      >
        <BrandEmployeeFirstnameController
          required
          name="firstname"
          control={personalityControl}
        />
        <BrandEmployeeLastnameController
          required
          name="lastname"
          control={personalityControl}
        />
        <BrandEmployeeGenderController
          required
          name="gender"
          control={personalityControl}
        />
        <BrandEmployeeBirthdayController
          name="birthday"
          control={personalityControl}
        />
        <BrandEmployeePassportController
          name="passport"
          control={personalityControl}
        />
        <BrandEmployeeTaxIdController
          name="taxId"
          control={personalityControl}
        />
      </SurveyStep>

      <SurveyStep
        skippable
        canGoNext={!!avatar}
        title={t('brand_employee.create.steps.avatar.title')}
        subtitle={t('brand_employee.create.steps.avatar.subtitle')}
      >
        <AvatarPicker
          allowsEditing
          removable={!!avatar}
          alignSelf="center"
          marginTop="$5"
          url={avatar}
          name={`${firstname} ${lastname}`}
          color="$placeholderColor"
          size={140}
          onAttach={setAvatar}
          onRemove={() => setAvatar(undefined)}
        />
      </SurveyStep>

      <SurveyStep
        canGoNext={contactFormState.isValid}
        title={t('brand_employee.create.steps.contact.title')}
        subtitle={t('brand_employee.create.steps.contact.subtitle')}
      >
        <BrandEmployeePhoneController
          required
          name="phone"
          control={contactControl}
        />
        <BrandEmployeeEmailController name="email" control={contactControl} />
        <BrandEmployeeAddressController
          name="address"
          control={contactControl}
        />
      </SurveyStep>

      <SurveyStep
        canGoNext={locationFormState.isValid}
        title={t('brand_employee.create.steps.location.title')}
        subtitle={t('brand_employee.create.steps.location.subtitle')}
      >
        <BrandEmployeeLocationController
          name="location"
          control={locationControl}
        />

        {location ? (
          <BrandEmployeeLocationCustomScheduleController
            name="customSchedule"
            control={locationControl}
          />
        ) : (
          <BrandEmployeeScheduleController
            name="customSchedule"
            control={locationControl}
          />
        )}

        {customSchedule && (
          <BrandEmployeeLocationScheduleController
            name="schedule"
            control={locationControl}
          />
        )}
      </SurveyStep>

      <SurveyStep
        canGoNext={professionalityFormState.isValid}
        title={t('brand_employee.create.steps.professionality.title')}
        subtitle={t('brand_employee.create.steps.professionality.subtitle')}
      >
        <BrandEmployeeRoleController
          required
          name="role"
          control={professionalityControl}
        />
        <BrandEmployeeProviderController
          name="provider"
          control={professionalityControl}
        />
      </SurveyStep>

      <SurveyStep
        canGoNext={permissionsFormState.isValid}
        title={t('brand_employee.create.steps.permissions.title')}
        subtitle={t('brand_employee.create.steps.permissions.subtitle')}
      >
        <BrandEmployeePermissionsController control={permissionsControl} />
      </SurveyStep>

      <SurveyStep
        skippable
        canGoNext={aboutFormState.isValid}
        title={t('brand_employee.create.steps.about.title')}
        subtitle={t('brand_employee.create.steps.about.subtitle')}
      >
        <BrandEmployeeAboutController
          noLabel
          required
          name="about"
          control={aboutControl}
        />
      </SurveyStep>
    </Survey>
  );
};
