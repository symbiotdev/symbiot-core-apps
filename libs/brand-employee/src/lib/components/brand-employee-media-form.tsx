import {
  BrandEmployee,
  useUpdateBrandEmployeeQuery,
} from '@symbiot-core-apps/api';
import { AvatarPicker } from '@symbiot-core-apps/ui';
import { useCallback } from 'react';
import { ImagePickerAsset } from 'expo-image-picker';

export const BrandEmployeeMediaForm = ({
  employee,
}: {
  employee: BrandEmployee;
}) => {
  const { mutateAsync: updateAvatar, isPending: avatarUpdating } =
    useUpdateBrandEmployeeQuery();

  const onAddAvatar = useCallback(
    (avatar: ImagePickerAsset) =>
      updateAvatar({
        id: employee.id,
        data: {
          avatar,
        },
      }),
    [employee.id, updateAvatar],
  );

  return (
    <AvatarPicker
      marginHorizontal="auto"
      loading={avatarUpdating}
      name={employee.name}
      color={employee?.avatarColor}
      url={employee.avatarUrl}
      size={100}
      onAttach={onAddAvatar}
    />
  );
};
