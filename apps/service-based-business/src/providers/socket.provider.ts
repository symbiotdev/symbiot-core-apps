import { PropsWithChildren, useCallback, useEffect } from 'react';
import {
  AnyBrandBooking,
  Brand,
  BrandBookingQueryKey,
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

  const { me, setMyStats, setMySubscriptions, updateMe, updateMePreferences } =
    useCurrentAccount();
  const {
    brand: currentBrand,
    setBrand: setCurrentBrand,
    setBrands: setCurrentBrands,
    setBrandStats: setCurrentBrandStats,
    setBrandSubscription: setCurrentBrandSubscription,
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
      setMyStats({
        newNotifications: 1,
      });
    },
    [
      currentBrand?.id,
      me?.preferences?.enableNotificationSound,
      addNotificationToListQueryState,
      setMyStats,
      soundPlayer,
    ],
  );

  const onNotificationsReadAll = useCallback(() => {
    markAllNotificationsAsRead();
    setMyStats({
      newNotifications: 0,
    });
  }, [setMyStats, markAllNotificationsAsRead]);

  const onUpdateBookings = useCallback(
    (bookings: AnyBrandBooking[]) => {
      upsertBookings(bookings);

      bookings.forEach((booking) => {
        queryClient.setQueryData(
          [BrandBookingQueryKey.detailedById, booking.id],
          booking,
        );
      });
    },
    [upsertBookings],
  );

  const onRemoveBookings = useCallback(
    (bookings: AnyBrandBooking[]) => {
      removeBookings(bookings);

      bookings.forEach((booking) => {
        queryClient.setQueryData(
          [BrandBookingQueryKey.detailedById, booking.id],
          booking,
        );
      });
    },
    [removeBookings],
  );

  useEffect(() => {
    if (process.env.EXPO_PUBLIC_APP_MODE !== 'production') {
      socket.onAny((data) => {
        console.log('Socket: ', data);
      })
    }

    socket.on(WebsocketAction.accountUpdated, updateMe);
    socket.on(WebsocketAction.accountPreferencesUpdated, updateMePreferences);

    socket.on(WebsocketAction.accountSubscriptionsUpdated, setMySubscriptions);

    socket.on(WebsocketAction.brandAssigned, onBrandAssigned);
    socket.on(WebsocketAction.brandUnassigned, onBrandUnassigned);
    socket.on(WebsocketAction.brandUpdated, setCurrentBrand);

    socket.on(WebsocketAction.brandStatsUpdated, setCurrentBrandStats);
    socket.on(
      WebsocketAction.brandSubscriptionUpdated,
      setCurrentBrandSubscription,
    );

    socket.on(WebsocketAction.brandEmployeeUpdated, setCurrentEmployee);

    socket.on(WebsocketAction.notificationAdded, onNotificationAdded);
    socket.on(WebsocketAction.notificationsRead, onNotificationsReadAll);

    socket.on(
      WebsocketAction.unavailableBrandBookingsCreated,
      onUpdateBookings,
    );
    socket.on(
      WebsocketAction.unavailableBrandBookingsUpdated,
      onUpdateBookings,
    );
    socket.on(
      WebsocketAction.unavailableBrandBookingsCanceled,
      onRemoveBookings,
    );
    socket.on(WebsocketAction.serviceBrandBookingsCanceled, onRemoveBookings);
    socket.on(WebsocketAction.serviceBrandBookingsCreated, onUpdateBookings);
    socket.on(WebsocketAction.serviceBrandBookingsUpdated, onUpdateBookings);
    socket.on(WebsocketAction.serviceBrandBookingClientAdded, onUpdateBookings);
    socket.on(
      WebsocketAction.serviceBrandBookingClientRemoved,
      onUpdateBookings,
    );

    return () => {
      socket.off();
    };
  }, [
    updateMe,
    setCurrentBrand,
    setCurrentBrandStats,
    setMySubscriptions,
    setCurrentBrandSubscription,
    setCurrentEmployee,
    onRemoveBookings,
    onUpdateBookings,
    updateMePreferences,
    onBrandAssigned,
    onNotificationAdded,
    onNotificationsReadAll,
    onBrandUnassigned,
  ]);

  return children;
};
