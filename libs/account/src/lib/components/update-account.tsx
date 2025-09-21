import { FormView, Input, PageView } from '@symbiot-core-apps/ui';
import { AccountAvatarForm } from './form/account-avatar-form';
import { useCurrentAccount } from '@symbiot-core-apps/state';
import {
  UpdateAccountData,
  useAccountMeRemoveAvatar,
  useAccountMeUpdate,
} from '@symbiot-core-apps/api';
import { useCallback } from 'react';
import { AccountFirstnameForm } from './form/account-firstname-form';
import { ImagePickerAsset } from 'expo-image-picker';
import { AccountLastnameForm } from './form/account-lastname-form';
import { useTranslation } from 'react-i18next';
import { AccountGenderForm } from './form/account-gender-form';
import { AccountBirthdayForm } from './form/account-birthday-form';
import { AccountPhonesForm } from './form/account-phones-form';
import { AccountInstagramsForm } from './form/account-instagrams-form';

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
        <AccountAvatarForm
          account={me}
          loading={avatarUploading || avatarRemoving}
          onAttach={onAttach}
          onRemove={onRemove}
        />

        <FormView>
          <Input
            disabled
            value={me.email}
            label={t('shared.account.form.email.label')}
          />

          <AccountFirstnameForm firstname={me.firstname} onUpdate={update} />
          <AccountLastnameForm lastname={me.lastname} onUpdate={update} />
          <AccountGenderForm gender={me.gender?.value} onUpdate={update} />
          <AccountBirthdayForm birthday={me.birthday} onUpdate={update} />
          <AccountPhonesForm phones={me.phones || []} onUpdate={update} />
          <AccountInstagramsForm instagrams={me.instagrams || []} onUpdate={update} />
        </FormView>
      </PageView>
    )
  );
};
