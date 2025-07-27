import { useCallback, useEffect } from 'react';
import { socket } from '@symbiot-core-apps/api';
import { useMe } from '@symbiot-core-apps/store';
import { Platform } from 'react-native';
import { AudioSource, useAudioPlayer } from 'expo-audio';

export const useSocketNotifications = ({
  soundSource,
}: {
  soundSource: AudioSource;
}) => {
  const { me } = useMe();

  const soundPlayer = useAudioPlayer(soundSource);

  const notificationAdded = useCallback(() => {
    if (Platform.OS !== 'web' || !me?.preferences?.enableNotificationSound) {
      return;
    }

    soundPlayer.play();
  }, [me?.preferences?.enableNotificationSound, soundPlayer]);

  return useEffect(() => {
    socket.on('account_notification_added', notificationAdded);

    return () => {
      socket.off('account_notification_added', notificationAdded);
    };
  });
};
