import { useCallback, useEffect } from 'react';
import {
  Notification,
  socket,
  useNotificationQueryState,
  WebsocketAction,
} from '@symbiot-core-apps/api';
import {
  useCurrentAccount,
  useCurrentBrandState,
} from '@symbiot-core-apps/state';
import { Platform } from 'react-native';
import { AudioSource, useAudioPlayer } from 'expo-audio';
import { ShowNativeSuccessAlert } from '@symbiot-core-apps/shared';

export const useSocketNotifications = ({
  soundSource,
}: {
  soundSource: AudioSource;
}) => {
  const soundPlayer = useAudioPlayer(soundSource);
  const { me, setMeStats } = useCurrentAccount();
  const { brand: currentBrand } = useCurrentBrandState();
  const { addToList: addToListQueryState, markAllAsRead } =
    useNotificationQueryState();

  const onAdded = useCallback(
    (notification: Notification) => {
      if (Platform.OS === 'web' && !!me?.preferences?.enableNotificationSound) {
        soundPlayer.play();

        ShowNativeSuccessAlert({
          title: notification.title,
          subtitle: notification.subtitle,
          duration: 5,
        });
      }

      if (currentBrand?.id !== notification.brand?.id) {
        return;
      }

      addToListQueryState(notification);
      setMeStats({
        newNotifications: 1,
      });
    },
    [
      currentBrand?.id,
      me?.preferences?.enableNotificationSound,
      addToListQueryState,
      setMeStats,
      soundPlayer,
    ],
  );

  const onReadAll = useCallback(() => {
    markAllAsRead();
    setMeStats({
      newNotifications: 0,
    });
  }, [setMeStats, markAllAsRead]);

  return useEffect(() => {
    socket.on(WebsocketAction.notificationAdded, onAdded);
    socket.on(WebsocketAction.notificationsRead, onReadAll);

    return () => {
      [
        WebsocketAction.notificationAdded,
        WebsocketAction.notificationsRead,
      ].forEach((event) => socket.off(event));
    };
  }, [onAdded, onReadAll]);
};
