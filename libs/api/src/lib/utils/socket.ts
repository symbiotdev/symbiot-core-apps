import io from 'socket.io-client';

export enum WebsocketAction {
  accountUpdated = 'account_updated',
  accountPreferencesUpdated = 'account_preferences_updated',
  // notifications
  notificationAdded = 'notification_added',
  notificationsRead = 'notifications_read',
  // brand
  brandAssigned = 'brand_assigned',
  brandUnassigned = 'brand_unassigned',
  brandCreated = 'brand_created',
  brandUpdated = 'brand_updated',
  // brand employee
  brandEmployeeUpdated = 'brand_employee_updated',
  // brand booking
  unavailableBrandBookingsCreated = 'unavailable_brand_bookings_created',
  unavailableBrandBookingsUpdated = 'unavailable_brand_bookings_updated',
  unavailableBrandBookingsCanceled = 'unavailable_brand_bookings_canceled',
  serviceBrandBookingsCreated = 'service_brand_bookings_created',
  serviceBrandBookingsCanceled = 'service_brand_bookings_canceled',
  serviceBrandBookingsUpdated = 'service_brand_bookings_updated',
  serviceBrandBookingClientAdded = 'service_brand_booking_client_added',
  serviceBrandBookingClientRemoved = 'service_brand_booking_client_removed',
}

export const socket = io(process.env.EXPO_PUBLIC_API_URL, {
  transports: ['websocket'],
  autoConnect: false,
  secure: true,
  withCredentials: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 100,
});

export default socket;
