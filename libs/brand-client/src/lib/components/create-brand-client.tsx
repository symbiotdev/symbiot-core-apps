import { AvatarPicker, Survey, SurveyStep } from '@symbiot-core-apps/ui';
import { useCreateBrandClientReq } from '@symbiot-core-apps/api';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { router, useNavigation } from 'expo-router';
import { EventArg, NavigationAction } from '@react-navigation/native';
import { ConfirmAlert, useI18n } from '@symbiot-core-apps/shared';
import { useForm } from 'react-hook-form';
import { BrandClientFirstnameController } from './controller/brand-client-firstname-controller';
import { BrandClientLastnameController } from './controller/brand-client-lastname-controller';
import { BrandClientGenderController } from './controller/brand-client-gender-controller';
import { BrandClientBirthdayController } from './controller/brand-client-birthday-controller';
import { BrandClientPhoneController } from './controller/brand-client-phone-controller';
import { BrandClientEmailController } from './controller/brand-client-email-controller';
import { BrandClientAddressController } from './controller/brand-client-address-controller';
import { ImagePickerAsset } from 'expo-image-picker';
import { BrandClientNoteController } from './controller/brand-client-note-controller';

export const CreateBrandClient = () => {
  const { t } = useI18n();
  const { mutateAsync, isPending } = useCreateBrandClientReq();
  const navigation = useNavigation();

  const createdRef = useRef(false);

  const [avatar, setAvatar] = useState<ImagePickerAsset>();

  const {
    control: personalityControl,
    getValues: personalityGetValues,
    formState: personalityFormState,
    watch: personalityWatch,
  } = useForm<{
    firstname: string;
    lastname: string;
    gender: string;
    birthday: string | null;
  }>({
    defaultValues: {
      firstname: '',
      lastname: '',
      gender: '',
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
    control: noteControl,
    getValues: noteGetValues,
    formState: noteFormState,
  } = useForm<{
    note: string;
  }>({
    defaultValues: {
      note: '',
    },
  });

  const onFinish = useCallback(async () => {
    const { firstname, lastname, gender, birthday } = personalityGetValues();
    const { phone, email, address } = contactGetValues();
    const { note } = noteGetValues();

    const client = await mutateAsync({
      avatar,
      firstname,
      lastname,
      gender,
      note,
      birthday: birthday ? String(birthday) : null,
      phones: [phone],
      emails: email ? [email] : [],
      addresses: address ? [address] : [],
    });

    createdRef.current = true;

    router.replace(`/clients/${client.id}/profile`);
  }, [
    avatar,
    contactGetValues,
    mutateAsync,
    noteGetValues,
    personalityGetValues,
  ]);

  const onLeave = useCallback(
    (e: EventArg<'beforeRemove', true, { action: NavigationAction }>) => {
      if (createdRef.current) return;

      e.preventDefault();

      ConfirmAlert({
        title: t('brand_client.create.discard.title'),
        message: t('brand_client.create.discard.message'),
        onAgree: () => navigation.dispatch(e.data.action),
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

  const { firstname, lastname } = personalityWatch();

  return (
    <Survey loading={isPending || createdRef.current} onFinish={onFinish}>
      <SurveyStep
        canGoNext={personalityFormState.isValid}
        title={t('brand_client.create.steps.personality.title')}
        subtitle={t('brand_client.create.steps.personality.subtitle')}
      >
        <BrandClientFirstnameController
          required
          name="firstname"
          control={personalityControl}
        />
        <BrandClientLastnameController
          required
          name="lastname"
          control={personalityControl}
        />
        <BrandClientGenderController
          required
          name="gender"
          control={personalityControl}
        />
        <BrandClientBirthdayController
          name="birthday"
          control={personalityControl}
        />
      </SurveyStep>

      <SurveyStep
        canGoNext={contactFormState.isValid}
        title={t('brand_client.create.steps.contact.title')}
        subtitle={t('brand_client.create.steps.contact.subtitle')}
      >
        <BrandClientPhoneController
          required
          name="phone"
          control={contactControl}
        />
        <BrandClientEmailController name="email" control={contactControl} />
        <BrandClientAddressController name="address" control={contactControl} />
      </SurveyStep>

      <SurveyStep
        skippable
        canGoNext={!!avatar}
        title={t('brand_client.create.steps.avatar.title')}
        subtitle={t('brand_client.create.steps.avatar.subtitle')}
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
        skippable
        canGoNext={noteFormState.isValid}
        title={t('brand_client.create.steps.note.title')}
        subtitle={t('brand_client.create.steps.note.subtitle')}
      >
        <BrandClientNoteController
          required
          noLabel
          name="note"
          control={noteControl}
        />
      </SurveyStep>
    </Survey>
  );
};
