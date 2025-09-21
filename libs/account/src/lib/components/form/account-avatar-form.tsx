import { AvatarPicker } from '@symbiot-core-apps/ui';
import { Account } from '@symbiot-core-apps/api';
import { ImagePickerAsset } from 'expo-image-picker';

export const AccountAvatarForm = ({
  account,
  loading,
  onAttach,
  onRemove,
}: {
  account: Account;
  loading?: boolean;
  onAttach: (image: ImagePickerAsset) => Promise<unknown> | unknown;
  onRemove?: () => Promise<unknown> | unknown;
}) => {
  return (
    <AvatarPicker
      alignSelf="center"
      loading={loading}
      name={account.name}
      color={account.avatarColor}
      url={account.avatarUrl}
      removable={!!account.avatarUrl}
      size={100}
      onAttach={onAttach}
      onRemove={onRemove}
    />
  );
};
