import io from 'socket.io-client';

export const socket = io(process.env.EXPO_PUBLIC_API_URL?.split('://')[1], {
  transports: ['websocket'],
  autoConnect: false,
  withCredentials: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 100,
});

export default socket;
