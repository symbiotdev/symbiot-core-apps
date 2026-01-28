import { FormView } from '@symbiot-core-apps/ui';
import {
  BrandLocation,
  useRemoveBrandLocationGalleryImagesReq,
  useUpdateBrandLocationReq,
  useUploadBrandLocationGalleryImagesReq,
} from '@symbiot-core-apps/api';
import { useCallback } from 'react';
import { ImagePickerAsset } from 'expo-image-picker';
import { useCurrentBrandState } from '@symbiot-core-apps/state';
import { View, ViewProps } from 'tamagui';
import { useI18n } from '@symbiot-core-apps/shared';
import {
  AvatarPicker,
  GalleryPicker,
} from '@symbiot-core-apps/form-controller';

export const BrandLocationMediaForm = ({
  location,
  ...viewProps
}: ViewProps & {
  location: BrandLocation;
}) => {
  const { brand } = useCurrentBrandState();
  const { t } = useI18n();
  const { mutateAsync: updateAvatar, isPending: avatarUpdating } =
    useUpdateBrandLocationReq();
  const { mutateAsync: uploadGalleryImages } =
    useUploadBrandLocationGalleryImagesReq();
  const { mutateAsync: removeGalleryImage } =
    useRemoveBrandLocationGalleryImagesReq();

  const extendGallery = useCallback(
    (images: ImagePickerAsset[]) =>
      uploadGalleryImages({ id: location.id, images }),
    [location.id, uploadGalleryImages],
  );

  const cutGallery = useCallback(
    (index: number) => {
      const image = location.gallery?.[index];

      return !image
        ? Promise.resolve()
        : removeGalleryImage({ id: location.id, imageName: image.name });
    },
    [location.gallery, location.id, removeGalleryImage],
  );

  const onAddAvatar = useCallback(
    (avatar: ImagePickerAsset) =>
      updateAvatar({
        id: location.id,
        data: {
          avatar,
        },
      }),
    [location.id, updateAvatar],
  );

  return (
    <FormView gap="$5" {...viewProps}>
      <View>
        <AvatarPicker
          marginHorizontal="auto"
          loading={avatarUpdating}
          name={location.name}
          color={brand?.avatarColor}
          url={location.avatar?.url || brand?.avatar?.url}
          size={100}
          onAttach={onAddAvatar}
        />
      </View>

      <GalleryPicker
        value={location.gallery?.map(({ xsUrl }) => xsUrl) || []}
        maxImages={10}
        label={t('brand_location.form.gallery.label')}
        onAdd={extendGallery}
        onRemove={cutGallery}
      />
    </FormView>
  );
};
