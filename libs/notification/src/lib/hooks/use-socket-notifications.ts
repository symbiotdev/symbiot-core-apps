import { useCallback, useEffect } from 'react';
import {
  AccountNotification,
  AccountStats,
  socket,
  useAccountNotificationQueryState,
} from '@symbiot-core-apps/api';
import {
  useAccountMeState,
  useAccountNotificationsState,
  useMe,
} from '@symbiot-core-apps/store';
import { Platform } from 'react-native';
import { AudioSource, useAudioPlayer } from 'expo-audio';
import { ShowNativeSuccessAlert } from '@symbiot-core-apps/shared';

export const useSocketNotifications = ({
  soundSource,
}: {
  soundSource: AudioSource;
}) => {
  const soundPlayer = useAudioPlayer(soundSource);
  const { me } = useMe();
  const { setMeStats } = useAccountMeState();
  const { add: addToInitialState } = useAccountNotificationsState();
  const { addToList: addToListQueryState, markAllAsRead } =
    useAccountNotificationQueryState();

  const onStatsUpdated = useCallback(
    (notifications: AccountStats['notifications']) =>
      setMeStats({
        notifications,
      }),
    [setMeStats],
  );

  const onAdded = useCallback(
    (notification: AccountNotification) => {
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

  const onReadAll = useCallback(
    (notifications: AccountStats['notifications']) => {
      markAllAsRead();

      setMeStats({
        notifications,
      });
    },
    [markAllAsRead, setMeStats],
  );

  return useEffect(() => {
    socket.on('account_notification_added', onAdded);
    socket.on('account_notification_stats_updated', onStatsUpdated);
    socket.on('account_notifications_read', onReadAll);

    return () => {
      [
        'account_notification_added',
        'account_notification_stats_updated',
        'account_notifications_read',
      ].forEach((event) => {
        socket.off(event);
      });
    };
  }, [onAdded, onStatsUpdated, onReadAll]);
};
