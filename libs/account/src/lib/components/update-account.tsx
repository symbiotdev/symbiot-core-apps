import { AvatarPicker, FormView, Input, PageView } from '@symbiot-core-apps/ui';
import { useCurrentAccountState } from '@symbiot-core-apps/state';
import {
  UpdateAccountData,
  useAccountMeRemoveAvatar,
  useAccountMeUpdate,
} from '@symbiot-core-apps/api';
import { useCallback } from 'react';
import { ImagePickerAsset } from 'expo-image-picker';
import { useTranslation } from 'react-i18next';
import {
  DateFrom,
  SingeElementForm,
  SingleElementToArrayForm,
} from '@symbiot-core-apps/form-controller';
import { AccountFirstnameController } from './controller/account-firstname-controller';
import { AccountLastnameController } from './controller/account-lastname-controller';
import { AccountGenderController } from './controller/account-gender-controller';
import { AccountBirthdayController } from './controller/account-birthday-controller';
import { AccountInstagramController } from './controller/account-instagram-controller';
import { AccountPhoneController } from './controller/account-phone-controller';

export const UpdateAccount = () => {
  const { me, setMe } = useCurrentAccountState();
  const { t } = useTranslation();
  const { mutateAsync } = useAccountMeUpdate();
  const { mutateAsync: uploadAvatar, isPending: avatarUploading } =
    useAccountMeUpdate();
  const { mutateAsync: removeAvatar, isPending: avatarRemoving } =
    useAccountMeRemoveAvatar();

  const onAttach = useCallback(
    async (avatar: ImagePickerAsset) => setMe(await uploadAvatar({ avatar })),
    [uploadAvatar, setMe],
  );

  const onRemove = useCallback(
    async () => setMe(await removeAvatar()),
    [removeAvatar, setMe],
  );

  const update = useCallback(
    async (data: UpdateAccountData) => setMe(await mutateAsync(data)),
    [setMe, mutateAsync],
  );

  return (
    me && (
      <PageView scrollable withHeaderHeight withKeyboard gap="$5">
        <AvatarPicker
          alignSelf="center"
          loading={avatarUploading || avatarRemoving}
          name={me.name}
          color={me.avatarColor}
          url={me.avatarUrl}
          removable={!!me.avatarUrl}
          size={100}
          onAttach={onAttach}
          onRemove={onRemove}
        />

        <FormView>
          <Input
            disabled
            value={me.email}
            label={t('shared.account.form.email.label')}
          />

          <SingeElementForm
            name="firstname"
            value={me.firstname}
            onUpdate={update}
            Controller={AccountFirstnameController}
          />
          <SingeElementForm
            name="lastname"
            value={me.lastname}
            onUpdate={update}
            Controller={AccountLastnameController}
          />
          <SingeElementForm
            name="gender"
            value={me.gender?.value}
            onUpdate={update}
            Controller={AccountGenderController}
          />
          <DateFrom
            name="birthday"
            value={me.birthday}
            onUpdate={update}
            Controller={AccountBirthdayController}
          />
          <SingleElementToArrayForm
            name="phones"
            value={me.phones || []}
            onUpdate={update}
            Controller={AccountPhoneController}
          />
          <SingleElementToArrayForm
            name="instagrams"
            value={me.instagrams || []}
            onUpdate={update}
            Controller={AccountInstagramController}
          />
        </FormView>
      </PageView>
    )
  );
};
