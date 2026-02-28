import { Survey, SurveyStep } from '@symbiot-core-apps/ui';
import { useCreateBrandClientReq } from '@symbiot-core-apps/api';
import React, { useCallback, useState } from 'react';
import { useI18n } from '@symbiot-core-apps/shared';
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
import { AvatarPicker } from '@symbiot-core-apps/form-controller';

export const CreateBrandClient = () => {
  const { t } = useI18n();
  const { mutateAsync, isPending } = useCreateBrandClientReq();

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

    return {
      replaceUrl: `/clients/${client.id}/profile`,
    };
  }, [
    avatar,
    contactGetValues,
    mutateAsync,
    noteGetValues,
    personalityGetValues,
  ]);

  const { firstname, lastname } = personalityWatch();

  return (
    <Survey
      loading={isPending}
      leaveAlertParams={{
        title: t('brand_client.create.discard.title'),
        subtitle: t('brand_client.create.discard.message'),
      }}
      onFinish={onFinish}
    >
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
