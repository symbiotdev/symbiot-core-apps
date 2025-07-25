import { AdaptivePopover } from '../popover/adaptive-popover';
import { Avatar } from '../media/avatar';
import { Popover, View, ViewProps } from 'tamagui';
import { ImageSource } from 'expo-image';
import { Link } from '../text/custom';
import { useTranslation } from 'react-i18next';
import { ListItem } from '../list/list-item';
import { Icon } from '../icons/icon';
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

export const maxAvatarFileSize = 10485760;
const pickerOptions: ImagePickerOptions = {
  mediaTypes: 'images',
  allowsEditing: true,
  allowsMultipleSelection: false,
  selectionLimit: 1,
  quality: 1,
};

export const AvatarPicker = ({
  name,
  size,
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

  const popoverRef = useRef<Popover>(null);

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
    <View alignItems="center" gap="$2" {...viewProps} width={size}>
      <Avatar url={url} name={name} size={size} color={color} />

      <AdaptivePopover
        placement="bottom"
        triggerType="child"
        minWidth={250}
        ref={popoverRef}
        disabled={loading || attaching}
        trigger={
          loading || attaching ? (
            <Spinner width={22} height={22} />
          ) : (
            <Link textAlign="center" pressStyle={{ opacity: 0.8 }}>
              {t('shared.preferences.avatar.trigger.label')}
            </Link>
          )
        }
      >
        <View paddingVertical="$2" paddingHorizontal="$5" gap="$2">
          <ListItem
            icon={<Icon.Dynamic type="Ionicons" name="image-outline" />}
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
              icon={<Icon.Dynamic type="Ionicons" name="camera-outline" />}
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
              icon={<Icon.Dynamic type="Ionicons" name="trash-outline" />}
              label={t('shared.preferences.avatar.action.delete.label')}
              onPress={deleteImage}
            />
          )}
        </View>
      </AdaptivePopover>
    </View>
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
