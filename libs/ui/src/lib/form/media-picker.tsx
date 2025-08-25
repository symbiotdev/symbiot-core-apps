import {
  ImagePickerAsset,
  ImagePickerOptions,
  ImagePickerResult,
  launchCameraAsync,
  launchImageLibraryAsync,
  PermissionStatus,
  useMediaLibraryPermissions,
} from 'expo-image-picker';
import { useTranslation } from 'react-i18next';
import { useCameraPermissions } from 'expo-camera';
import { ReactElement, useCallback, useRef, useState } from 'react';
import {
  AdaptivePopover,
  AdaptivePopoverRef,
} from '../popover/adaptive-popover';
import { ConfirmAlert, ShowNativeFailedAlert } from '@symbiot-core-apps/shared';
import { filesize } from 'filesize';
import { ListItem } from '../list/list-item';
import { Icon } from '../icons';
import { Linking, Platform } from 'react-native';
import { View } from 'tamagui';
import { Link } from '../text/custom';

export const maxAvatarFileSize = 10485760;

export const MediaPicker = ({
  trigger,
  removable,
  quality = 1,
  onAdd,
  onRemove,
  ...imagePickerOptions
}: ImagePickerOptions & {
  trigger: ReactElement;
  removable?: boolean;
  onAdd: (images: ImagePickerAsset[]) => Promise<void>;
  onRemove?: () => Promise<void>;
}) => {
  const { t } = useTranslation();
  const [galleryPermissions, requestGalleryPermissions] =
    useMediaLibraryPermissions();
  const [cameraPermissions, requestCameraPermissions] = useCameraPermissions();

  const popoverRef = useRef<AdaptivePopoverRef>(null);

  const [processing, setProcessing] = useState(false);

  const pickFromGallery = useCallback(async () => {
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

    return launchImageLibraryAsync(imagePickerOptions);
  }, [
    galleryPermissions?.granted,
    galleryPermissions?.status,
    imagePickerOptions,
    requestGalleryPermissions,
    t,
  ]);

  const openCamera = useCallback(async () => {
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

    return launchCameraAsync(imagePickerOptions);
  }, [
    cameraPermissions?.granted,
    cameraPermissions?.status,
    imagePickerOptions,
    requestCameraPermissions,
    t,
  ]);

  const pick = useCallback(
    async (type: 'gallery' | 'camera') => {
      setProcessing(true);

      popoverRef.current?.close?.();

      try {
        const result: ImagePickerResult = await (type === 'gallery'
          ? pickFromGallery()
          : openCamera());

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

        await onAdd(result.assets);
      } finally {
        setProcessing(false);
      }
    },
    [onAdd, openCamera, pickFromGallery, t],
  );

  const remove = useCallback(() => {
    popoverRef.current?.close?.();

    ConfirmAlert({
      title: t('shared.preferences.avatar.action.delete.confirm.title'),
      message: t('shared.preferences.avatar.action.delete.confirm.message'),
      callback: async () => {
        setProcessing(true);
        try {
          await onRemove?.();
        } finally {
          setProcessing(false);
        }
      },
    });
  }, [onRemove, t]);

  return (
    <AdaptivePopover
      placement="bottom"
      triggerType="child"
      minWidth={250}
      ref={popoverRef}
      disabled={processing}
      sheetTitle={t('shared.preferences.avatar.trigger.label')}
      trigger={trigger}
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
          onPress={() => pick('gallery')}
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
            onPress={() => pick('camera')}
          />
        )}

        {removable && (
          <ListItem
            color="$error"
            icon={<Icon name="TrashBinMinimalistic" />}
            label={t('shared.preferences.avatar.action.delete.label')}
            onPress={remove}
          />
        )}
      </View>
    </AdaptivePopover>
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
