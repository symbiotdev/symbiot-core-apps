import { Image, ImageSource } from 'expo-image';
import { ImagePickerAsset } from 'expo-image-picker';
import { FormField } from './form-field';
import { AnimatedList } from '../list/animated-list';
import { View, XStack } from 'tamagui';
import { useCallback, useState } from 'react';
import { RegularText } from '../text/text';
import { avatarBlurhash } from '../media/avatar';
import { ButtonIcon } from '../button/button';
import { MediaPicker } from './media-picker';
import { Platform } from 'react-native';
import { Spinner } from '../loading/spinner';
import { defaultPageHorizontalPadding } from '../view/page-view';

const MediaList = AnimatedList<ImageSource | string>;

export const GalleryPicker = ({
  label,
  value,
  maxImages,
  onAdd,
  imageSize = 112,
  onRemove,
}: {
  label?: string;
  value: (ImageSource | string)[];
  maxImages: number;
  imageSize?: number;
  onAdd: (images: ImagePickerAsset[]) => Promise<unknown>;
  onRemove: (index: number) => Promise<unknown>;
}) => {
  const [uploading, setUploading] = useState(false);
  const [removingIndex, setRemovingIndex] = useState<number | null>(null);

  const removeImage = useCallback(
    async (index: number) => {
      try {
        setRemovingIndex(index);
        await onRemove(index);
      } finally {
        setRemovingIndex(null);
      }
    },
    [onRemove],
  );

  const addImages = useCallback(
    async (images: ImagePickerAsset[]) => {
      try {
        setUploading(true);

        await onAdd(images);
      } finally {
        setUploading(false);
      }
    },
    [onAdd],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: ImageSource | string; index: number }) => (
      <View position="relative">
        {removingIndex === null && (
          <ButtonIcon
            type="danger"
            position="absolute"
            iconName="TrashBinMinimalistic"
            iconSize={20}
            right={-5}
            top={-5}
            size={24}
            zIndex={1}
            onPress={() => removeImage(index)}
          />
        )}

        <View
          width={imageSize}
          height={imageSize}
          borderRadius="$10"
          overflow="hidden"
        >
          {removingIndex === index && (
            <View
              position="absolute"
              width="100%"
              height="100%"
              justifyContent="center"
              alignItems="center"
              backgroundColor="$background"
              opacity={0.5}
              zIndex={1}
            >
              <Spinner size="small" />
            </View>
          )}

          <Image
            source={item}
            allowDownscaling={false}
            style={{ flex: 1 }}
            placeholder={{ blurhash: avatarBlurhash }}
          />
        </View>
      </View>
    ),
    [imageSize, removingIndex, removeImage],
  );

  const ListFooterComponent = useCallback(
    () => (
      <XStack gap={6}>
        {Array.from({ length: Math.max(4 - value.length, 0) }).map((_, i) => (
          <View
            key={i}
            width={imageSize}
            height={imageSize}
            backgroundColor="$background1"
            borderRadius="$10"
          />
        ))}
      </XStack>
    ),
    [imageSize, value.length],
  );

  return (
    <FormField label={label}>
      <MediaList
        horizontal
        data={value}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={Platform.OS === 'web'}
        contentContainerStyle={{
          gap: 6,
          paddingVertical: 5,
          paddingHorizontal: defaultPageHorizontalPadding,
        }}
        ListFooterComponent={ListFooterComponent}
        ListHeaderComponent={
          value.length >= maxImages ? null : (
            <AddImage
              loading={uploading}
              disabled={removingIndex !== null || uploading}
              limit={maxImages - value.length}
              imageSize={imageSize}
              onAdd={addImages}
            />
          )
        }
      />
    </FormField>
  );
};

const AddImage = ({
  loading,
  disabled,
  limit,
  imageSize,
  onAdd,
}: {
  loading: boolean;
  disabled: boolean;
  limit: number;
  imageSize: number;
  onAdd: (images: ImagePickerAsset[]) => Promise<void>;
}) => (
  <MediaPicker
    allowsMultipleSelection
    selectionLimit={limit}
    trigger={
      <View
        disabled={disabled}
        width={imageSize}
        height={imageSize}
        justifyContent="center"
        alignItems="center"
        backgroundColor="$background1"
        borderRadius="$10"
        cursor="pointer"
        pressStyle={{ opacity: 0.8 }}
        disabledStyle={{ opacity: 0.5 }}
      >
        {!loading ? (
          <RegularText fontSize={imageSize / 5}>+</RegularText>
        ) : (
          <Spinner size="small" />
        )}
      </View>
    }
    onAdd={onAdd}
  />
);
