import {
  BrandService,
  useUpdateBrandServiceQuery,
} from '@symbiot-core-apps/api';
import { AvatarPicker } from '@symbiot-core-apps/ui';
import { useCallback } from 'react';
import { ImagePickerAsset } from 'expo-image-picker';
import { useWindowDimensions } from 'react-native';

export const BrandServiceAvatarForm = ({
  service,
}: {
  service: BrandService;
}) => {
  const { height } = useWindowDimensions();
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
      allowsEditing={false}
      marginHorizontal="auto"
      loading={avatarUpdating}
      name={service.name}
      borderRadius="$10"
      color="$background1"
      url={service.avatarUrl}
      size={{
        width: '100%',
        height: Math.max(height / 3, 250),
      }}
      onAttach={onAddAvatar}
    />
  );
};
