import { PropsWithChildren, useCallback, useEffect } from 'react';
import {
  Brand,
  clearInitialQueryData,
  Notification,
  queryClient,
  socket,
  useNotificationReqState,
  WebsocketAction,
} from '@symbiot-core-apps/api';
import {
  useCurrentAccount,
  useCurrentBrandBookingsState,
  useCurrentBrandEmployee,
  useCurrentBrandState,
} from '@symbiot-core-apps/state';
import { useAuthBrand } from '@symbiot-core-apps/brand';
import { Platform } from 'react-native';
import { ShowNativeSuccessAlert } from '@symbiot-core-apps/shared';
import { useAudioPlayer } from 'expo-audio';
import { router } from 'expo-router';

export const SocketProvider = ({ children }: PropsWithChildren) => {
  const switchBrand = useAuthBrand();
  const soundPlayer = useAudioPlayer(
    require('../../assets/audio/new_notification_sound.wav'),
  );

  const { me, setMeStats, updateMe, updateMePreferences } = useCurrentAccount();
  const {
    brand: currentBrand,
    setBrand: setCurrentBrand,
    setBrands: setCurrentBrands,
  } = useCurrentBrandState();
  const { setCurrentEmployee } = useCurrentBrandEmployee();
  const { upsertBookings, removeBookings } = useCurrentBrandBookingsState();
  const {
    addToList: addNotificationToListQueryState,
    markAllAsRead: markAllNotificationsAsRead,
  } = useNotificationReqState();

  const onBrandAssigned = useCallback(
    (brand: Brand) => {
      if (currentBrand?.id) return;

      void switchBrand({ id: brand.id });
    },
    [currentBrand?.id, switchBrand],
  );

  const onBrandUnassigned = useCallback(
    (brand: Brand) => {
      setCurrentEmployee(undefined);
      setCurrentBrand(undefined);
      setCurrentBrands([]);
      router.replace('/');
      clearInitialQueryData();
      queryClient.clear();
    },
    [setCurrentEmployee, setCurrentBrand, setCurrentBrands],
  );

  const onNotificationAdded = useCallback(
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

      addNotificationToListQueryState(notification);
      setMeStats({
        newNotifications: 1,
      });
    },
    [
      currentBrand?.id,
      me?.preferences?.enableNotificationSound,
      addNotificationToListQueryState,
      setMeStats,
      soundPlayer,
    ],
  );

  const onNotificationsReadAll = useCallback(() => {
    markAllNotificationsAsRead();
    setMeStats({
      newNotifications: 0,
    });
  }, [setMeStats, markAllNotificationsAsRead]);

  useEffect(() => {
    socket.on(WebsocketAction.accountUpdated, updateMe);
    socket.on(WebsocketAction.accountPreferencesUpdated, updateMePreferences);

    socket.on(WebsocketAction.brandAssigned, onBrandAssigned);
    socket.on(WebsocketAction.brandUnassigned, onBrandUnassigned);
    socket.on(WebsocketAction.brandUpdated, setCurrentBrand);

    socket.on(WebsocketAction.brandEmployeeUpdated, setCurrentEmployee);

    socket.on(WebsocketAction.notificationAdded, onNotificationAdded);
    socket.on(WebsocketAction.notificationsRead, onNotificationsReadAll);

    socket.on(WebsocketAction.unavailableBrandBookingsCreated, upsertBookings);
    socket.on(WebsocketAction.unavailableBrandBookingsUpdated, upsertBookings);
    socket.on(WebsocketAction.unavailableBrandBookingsCanceled, removeBookings);
    socket.on(WebsocketAction.serviceBrandBookingsCanceled, removeBookings);
    socket.on(WebsocketAction.serviceBrandBookingsCreated, upsertBookings);
    socket.on(WebsocketAction.serviceBrandBookingsUpdated, upsertBookings);
    socket.on(WebsocketAction.serviceBrandBookingClientAdded, upsertBookings);
    socket.on(WebsocketAction.serviceBrandBookingClientRemoved, upsertBookings);

    return () => {
      socket.off();
    };
  }, [
    updateMe,
    setCurrentBrand,
    setCurrentEmployee,
    upsertBookings,
    removeBookings,
    updateMePreferences,
    onBrandAssigned,
    onNotificationAdded,
    onNotificationsReadAll,
    onBrandUnassigned,
  ]);

  return children;
};
