import { Avatar } from '../media/avatar';
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
  url,
  loading,
  removable,
  onAttach,
  onRemove,
  ...viewProps
}: ViewProps & {
  name: string;
  size: number;
  label?: string;
  color?: string;
  url?: ImageSource | string;
  loading?: boolean;
  removable?: boolean;
  onAttach: (image: ImagePickerAsset) => Promise<unknown> | unknown;
  onRemove?: () => Promise<unknown> | unknown;
}) => {
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
        width={size}
      >
        <Avatar url={url} name={name} size={size} color={color} />

        {(loading || processing) && (
          <View
            position="absolute"
            backgroundColor="$color"
            opacity={0.5}
            zIndex={1}
            width="100%"
            height="100%"
            borderRadius="100%"
            justifyContent="center"
            alignItems="center"
          >
            <Spinner color="$buttonTextColor" />
          </View>
        )}

        <MediaPicker
          allowsEditing
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
                iconSize={size / 7}
                size={size / 4}
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
