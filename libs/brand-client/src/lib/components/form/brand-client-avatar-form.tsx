import { BrandClient, useUpdateBrandClientQuery } from '@symbiot-core-apps/api';
import { AvatarPicker } from '@symbiot-core-apps/ui';
import { useCallback } from 'react';
import { ImagePickerAsset } from 'expo-image-picker';

export const BrandClientAvatarForm = ({ client }: { client: BrandClient }) => {
  const { mutateAsync: updateAvatar, isPending: avatarUpdating } =
    useUpdateBrandClientQuery();

  const onAddAvatar = useCallback(
    (avatar: ImagePickerAsset) =>
      updateAvatar({
        id: client.id,
        data: {
          avatar,
        },
      }),
    [client.id, updateAvatar],
  );

  return (
    <AvatarPicker
      marginHorizontal="auto"
      loading={avatarUpdating}
      name={`${client.firstname} ${client.lastname}`}
      color="$background1"
      url={client.avatarUrl}
      size={100}
      onAttach={onAddAvatar}
    />
  );
};
