import io from 'socket.io-client';

export enum WebsocketAction {
  accountUpdated = 'account_updated',
  accountLinkAdded = 'account_link_added',
  accountLinkUpdated = 'account_link_updated',
  accountLinkRemoved = 'account_link_removed',
  // notifications
  notificationAdded = 'notification_added',
  notificationsRead = 'notifications_read',
  // brand
  brandAdded = 'brand_added',
  brandUpdated = 'brand_updated',
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
