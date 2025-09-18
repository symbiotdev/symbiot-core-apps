import {
  BrandService,
  useUpdateBrandServiceQuery,
} from '@symbiot-core-apps/api';
import { AvatarPicker } from '@symbiot-core-apps/ui';
import { useCallback } from 'react';
import { ImagePickerAsset } from 'expo-image-picker';

export const BrandServiceAvatarForm = ({
  service,
}: {
  service: BrandService;
}) => {
  const { mutateAsync: updateAvatar, isPending: avatarUpdating } =
    useUpdateBrandServiceQuery();

  const onAddAvatar = useCallback(
    (avatar: ImagePickerAsset) =>
      updateAvatar({
        id: service.id,
        data: {
          avatar,
        },
      }),
    [service.id, updateAvatar],
  );

  return (
    <AvatarPicker
      marginHorizontal="auto"
      loading={avatarUpdating}
      name={service.name}
      borderRadius="$10"
      color="$background1"
      url={service.avatarUrl}
      size={{
        width: '100%',
        height: 300,
      }}
      onAttach={onAddAvatar}
    />
  );
};
