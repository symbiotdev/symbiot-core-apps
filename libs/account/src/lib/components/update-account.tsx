import { AvatarPicker, FormView, Input, PageView } from '@symbiot-core-apps/ui';
import { useCurrentAccount } from '@symbiot-core-apps/state';
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
  SingleStringArrayForm,
  StringForm,
} from '@symbiot-core-apps/form-controller';
import { AccountFirstnameController } from './controller/account-firstname-controller';
import { AccountLastnameController } from './controller/account-lastname-controller';
import { AccountGenderController } from './controller/account-gender-controller';
import { AccountBirthdayController } from './controller/account-birthday-controller';
import { AccountInstagramController } from './controller/account-instagram-controller';
import { AccountPhoneController } from './controller/account-phone-controller';

export const UpdateAccount = () => {
  const { t } = useTranslation();
  const { me, updateMe } = useCurrentAccount();
  const { mutateAsync } = useAccountMeUpdate();
  const { mutateAsync: uploadAvatar, isPending: avatarUploading } =
    useAccountMeUpdate();
  const { mutateAsync: removeAvatar, isPending: avatarRemoving } =
    useAccountMeRemoveAvatar();

  const onAttach = useCallback(
    async (avatar: ImagePickerAsset) =>
      updateMe(await uploadAvatar({ avatar })),
    [uploadAvatar, updateMe],
  );

  const onRemove = useCallback(
    async () => updateMe(await removeAvatar()),
    [removeAvatar, updateMe],
  );

  const update = useCallback(
    async (data: UpdateAccountData) => updateMe(await mutateAsync(data)),
    [updateMe, mutateAsync],
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

          <StringForm
            name="firstname"
            value={me.firstname}
            onUpdate={update}
            Controller={AccountFirstnameController}
          />
          <StringForm
            name="lastname"
            value={me.lastname}
            onUpdate={update}
            Controller={AccountLastnameController}
          />
          <StringForm
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
          <SingleStringArrayForm
            name="phones"
            value={me.phones || []}
            onUpdate={update}
            Controller={AccountPhoneController}
          />
          <SingleStringArrayForm
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
