import io from 'socket.io-client';

export enum WebsocketAction {
  accountUpdated = 'account_updated',
  // notifications
  notificationAdded = 'notification_added',
  notificationsRead = 'notifications_read',
  // brand
  brandAdded = 'brand_added',
  brandUpdated = 'brand_updated',
  // brand employee
  brandEmployeeUpdated = 'brand_employee_updated',
}

export const socket = io(process.env.EXPO_PUBLIC_API_URL?.split('://')[1], {
  transports: ['websocket'],
  autoConnect: false,
  secure: true,
  withCredentials: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 100,
});

export default socket;
