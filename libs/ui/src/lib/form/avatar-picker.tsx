import {
  AdaptivePopover,
  AdaptivePopoverRef,
} from '../popover/adaptive-popover';
import { Avatar } from '../media/avatar';
import { View, ViewProps } from 'tamagui';
import { ImageSource } from 'expo-image';
import { Link } from '../text/custom';
import { ListItem } from '../list/list-item';
import { Spinner } from '../loading/spinner';
import { useCallback, useRef, useState } from 'react';
import {
  ImagePickerAsset,
  ImagePickerOptions,
  ImagePickerResult,
  launchCameraAsync,
  launchImageLibraryAsync,
  PermissionStatus,
  useMediaLibraryPermissions,
} from 'expo-image-picker';
import { useCameraPermissions } from 'expo-camera';
import { ConfirmAlert, ShowNativeFailedAlert } from '@symbiot-core-apps/shared';
import { filesize } from 'filesize';
import { Linking, Platform } from 'react-native';
import { Icon } from '../icons';
import { useTranslation } from 'react-i18next';
import { FormField } from './form-field';
import { ButtonIcon } from '../button/button';

export const maxAvatarFileSize = 10485760;
const pickerOptions: ImagePickerOptions = {
  mediaTypes: 'images',
  allowsEditing: true,
  allowsMultipleSelection: false,
  selectionLimit: 1,
  quality: 1,
  aspect: [1, 1],
};

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
  onAttach: (images: ImagePickerAsset[]) => void;
  onRemove?: () => void;
}) => {
  const { t } = useTranslation();
  const [galleryPermissions, requestGalleryPermissions] =
    useMediaLibraryPermissions();
  const [cameraPermissions, requestCameraPermissions] = useCameraPermissions();

  const [attaching, setAttaching] = useState(false);

  const popoverRef = useRef<AdaptivePopoverRef>(null);

  const pickImageFromGallery = useCallback(async () => {
    if (!galleryPermissions?.granted) {
      await requestGalleryPermissions();
    }

    if (galleryPermissions?.status === PermissionStatus.DENIED) {
      ShowNativeFailedAlert({
        text: t(
          'shared.preferences.avatar.action.choose_from_gallery.error.permissions_denied',
        ),
      });

      throw new Error('Selection canceled');
    }

    return launchImageLibraryAsync(pickerOptions);
  }, [
    galleryPermissions?.granted,
    galleryPermissions?.status,
    requestGalleryPermissions,
    t,
  ]);

  const takePhoto = useCallback(async () => {
    if (!cameraPermissions?.granted) {
      await requestCameraPermissions();
    }

    if (cameraPermissions?.status === PermissionStatus.DENIED) {
      ShowNativeFailedAlert({
        text: t(
          'shared.preferences.avatar.action.take_phone.error.permissions_denied',
        ),
      });

      throw new Error('Selection canceled');
    }

    return launchCameraAsync(pickerOptions);
  }, [
    cameraPermissions?.granted,
    cameraPermissions?.status,
    requestCameraPermissions,
    t,
  ]);

  const pickImage = useCallback(
    async (type: 'gallery' | 'camera') => {
      setAttaching(true);

      popoverRef.current?.close?.();

      try {
        const result: ImagePickerResult = await (type === 'gallery'
          ? pickImageFromGallery()
          : takePhoto());

        if (!result.assets?.length) {
          throw new Error('Selection canceled');
        }

        if (
          result.assets.some(
            ({ fileSize }) => fileSize && fileSize >= maxAvatarFileSize,
          )
        ) {
          ShowNativeFailedAlert({
            text: t('shared.error.validation_error.media_size', {
              size: filesize(maxAvatarFileSize, {
                base: 2,
                standard: 'jedec',
              }),
            }),
          });

          return;
        }
        onAttach(result.assets);
      } finally {
        setAttaching(false);
      }
    },
    [onAttach, pickImageFromGallery, t, takePhoto],
  );

  const deleteImage = useCallback(() => {
    popoverRef.current?.close?.();

    ConfirmAlert({
      title: t('shared.preferences.avatar.action.delete.confirm.title'),
      message: t('shared.preferences.avatar.action.delete.confirm.message'),
      callback: () => {
        onRemove?.();
      },
    });
  }, [onRemove, t]);

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

        {(loading || attaching) && (
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

        <AdaptivePopover
          placement="bottom"
          triggerType="child"
          minWidth={250}
          ref={popoverRef}
          disabled={loading || attaching}
          sheetTitle={t('shared.preferences.avatar.trigger.label')}
          trigger={
            !loading && !attaching ? (
              <ButtonIcon
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
        >
          <View gap="$2">
            <ListItem
              icon={<Icon name="Gallery" />}
              label={t(
                'shared.preferences.avatar.action.choose_from_gallery.label',
              )}
              disabled={galleryPermissions?.status === PermissionStatus.DENIED}
              iconAfter={
                galleryPermissions?.status === PermissionStatus.DENIED && (
                  <AppSettings />
                )
              }
              onPress={() => pickImage('gallery')}
            />

            {Platform.OS !== 'web' && (
              <ListItem
                icon={<Icon name="Camera" />}
                label={t('shared.preferences.avatar.action.take_phone.label')}
                disabled={cameraPermissions?.status === PermissionStatus.DENIED}
                iconAfter={
                  cameraPermissions?.status === PermissionStatus.DENIED && (
                    <AppSettings />
                  )
                }
                onPress={() => pickImage('camera')}
              />
            )}

            {removable && (
              <ListItem
                color="$error"
                icon={<Icon name="TrashBinMinimalistic" />}
                label={t('shared.preferences.avatar.action.delete.label')}
                onPress={deleteImage}
              />
            )}
          </View>
        </AdaptivePopover>
      </View>
    </FormField>
  );
};

const AppSettings = () => {
  const { t } = useTranslation();

  return (
    <Link cursor="pointer" onPress={Linking.openSettings}>
      {t('shared.settings')}
    </Link>
  );
};
