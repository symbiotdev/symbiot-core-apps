import { useCallback, useEffect } from 'react';
import {
  Notification,
  socket,
  useNotificationQueryState,
} from '@symbiot-core-apps/api';
import {
  useCurrentAccount,
  useNotificationsState,
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
  const { add: addToInitialState } = useNotificationsState();
  const { addToList: addToListQueryState, markAllAsRead } =
    useNotificationQueryState();

  const onAdded = useCallback(
    (notification: Notification) => {
      addToInitialState(notification);
      addToListQueryState(notification);

      if (Platform.OS === 'web' && !!me?.preferences?.enableNotificationSound) {
        soundPlayer.play();

        ShowNativeSuccessAlert({
          title: notification.title,
          subtitle: notification.subtitle,
          duration: 5,
        });
      }
    },
    [
      me?.preferences?.enableNotificationSound,
      addToInitialState,
      addToListQueryState,
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
    socket.on('notification_added', onAdded);
    socket.on('notifications_read', onReadAll);

    return () => {
      ['notification_added', 'notifications_read'].forEach((event) =>
        socket.off(event),
      );
    };
  }, [onAdded, onReadAll]);
};
