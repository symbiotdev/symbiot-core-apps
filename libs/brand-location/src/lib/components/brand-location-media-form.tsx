import {
  AvatarPicker,
  defaultPageVerticalPadding,
  GalleryPicker,
} from '@symbiot-core-apps/ui';
import {
  BrandLocation,
  useRemoveBrandLocationGalleryImagesQuery,
  useUpdateBrandLocationQuery,
  useUploadBrandLocationGalleryImagesQuery,
} from '@symbiot-core-apps/api';
import { useBrandLocationForm } from '../hooks/use-brand-location-form';
import { useCallback } from 'react';
import { ImagePickerAsset } from 'expo-image-picker';
import { useTranslation } from 'react-i18next';
import { useCurrentBrandState } from '@symbiot-core-apps/state';
import { View } from 'tamagui';

export const BrandLocationMediaForm = ({
  location,
}: {
  location: BrandLocation;
}) => {
  const { t } = useTranslation();
  const { brand } = useCurrentBrandState();
  const form = useBrandLocationForm();
  const { mutateAsync: updateAvatar, isPending: avatarUpdating } =
    useUpdateBrandLocationQuery();
  const { mutateAsync: uploadGalleryImages } =
    useUploadBrandLocationGalleryImagesQuery();
  const { mutateAsync: removeGalleryImage } =
    useRemoveBrandLocationGalleryImagesQuery();

  const extendGallery = useCallback(
    (images: ImagePickerAsset[]) => uploadGalleryImages({ images }),
    [uploadGalleryImages],
  );

  const cutGallery = useCallback(
    (index: number) => {
      const image = location.gallery?.[index];

      return !image ? Promise.resolve() : removeGalleryImage({ id: image.id });
    },
    [location.gallery, removeGalleryImage],
  );

  const onAddAvatar = useCallback(
    (images: ImagePickerAsset[]) =>
      updateAvatar({
        id: location.id,
        data: {
          avatar: images[0],
        },
      }),
    [location.id, updateAvatar],
  );

  return (
    <View gap="$5">
      <AvatarPicker
        marginLeft={defaultPageVerticalPadding}
        label={t('shared.logotype')}
        loading={avatarUpdating}
        name={location.name}
        color={brand?.avatarColor}
        url={location.avatarUrl || brand?.avatarUrl}
        size={100}
        onAttach={onAddAvatar}
      />

      <GalleryPicker
        value={location.gallery?.map(({ xsUrl }) => xsUrl) || []}
        maxImages={form.gallery.maxImages}
        label={form.gallery.label}
        onAdd={extendGallery}
        onRemove={cutGallery}
      />
    </View>
  );
};
