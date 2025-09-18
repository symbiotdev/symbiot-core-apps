import { Avatar, AvatarSize } from '../media/avatar';
import { View, ViewProps } from 'tamagui';
import { ImageSource } from 'expo-image';
import { Spinner } from '../loading/spinner';
import { useCallback, useState } from 'react';
import { ImagePickerAsset } from 'expo-image-picker';
import { FormField } from './form-field';
import { ButtonIcon } from '../button/button';
import { MediaPicker } from './media-picker';

export const AvatarPicker = ({
  name,
  size,
  label,
  color,
  borderRadius = '100%',
  url,
  loading,
  removable,
  allowsEditing,
  onAttach,
  onRemove,
  ...viewProps
}: ViewProps & {
  name: string;
  size: AvatarSize;
  label?: string;
  color?: string;
  url?: ImageSource | string;
  loading?: boolean;
  allowsEditing?: boolean;
  removable?: boolean;
  onAttach: (image: ImagePickerAsset) => Promise<unknown> | unknown;
  onRemove?: () => Promise<unknown> | unknown;
}) => {
  const width = typeof size === 'number' ? size : size.width;

  const [processing, setProcessing] = useState(false);

  const add = useCallback(
    async (images: ImagePickerAsset[]) => {
      setProcessing(true);

      try {
        await onAttach(images[0]);
      } finally {
        setProcessing(false);
      }
    },
    [onAttach],
  );

  const remove = useCallback(async () => {
    setProcessing(true);

    try {
      await onRemove?.();
    } finally {
      setProcessing(false);
    }
  }, [onRemove]);

  return (
    <FormField label={label}>
      <View
        alignItems="center"
        gap="$2"
        position="relative"
        {...viewProps}
        width={width}
      >
        <Avatar
          url={url}
          name={name}
          size={size}
          color={color}
          borderRadius={borderRadius}
        />

        {(loading || processing) && (
          <View
            position="absolute"
            backgroundColor="$color"
            opacity={0.5}
            zIndex={1}
            width="100%"
            height="100%"
            borderRadius={borderRadius}
            justifyContent="center"
            alignItems="center"
          >
            <Spinner color="$buttonTextColor" />
          </View>
        )}

        <MediaPicker
          allowsEditing={allowsEditing}
          removable={removable}
          selectionLimit={1}
          aspect={[1, 1]}
          mediaTypes={['images']}
          trigger={
            !loading && !processing ? (
              <ButtonIcon
                hapticable={false}
                position="absolute"
                bottom={0}
                right={0}
                iconName="Pen"
              />
            ) : (
              <View position="absolute" />
            )
          }
          onAdd={add}
          onRemove={remove}
        />
      </View>
    </FormField>
  );
};
