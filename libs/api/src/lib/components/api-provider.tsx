import { setAxiosInterceptors } from '../utils/axios-interceptors';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import socket from '../utils/socket';
import { authTokenHeaderKey, useAuthTokens } from '../hooks/use-auth-tokens';
import { useDevId } from '../hooks/use-dev-id';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../utils/client';
import { useAccountAuthRefreshTokenQuery } from '../queries/use-account-auth.query';
import { Platform } from 'react-native';
import { useT } from '@symbiot-core-apps/i18n';

type SocketState = {
  connecting: boolean;
  connected: boolean;
  connectError: Error | undefined;
};

const ApiContext = createContext({});

export const ApiProvider = ({
  children,
  onConnected,
  onUnauthorized,
  onNoRespond,
}: PropsWithChildren<{
  onNoRespond: () => void;
  onUnauthorized: () => void;
  onConnected?: () => void;
}>) => {
  const devId = useDevId();
  const { lang } = useT();
  const refreshTokens = useAccountAuthRefreshTokenQuery();
  const { tokens, setTokens } = useAuthTokens();

  const stateRef = useRef<SocketState>({
    connecting: false,
    connected: false,
    connectError: undefined,
  });
  const [value, setValue] = useState(stateRef.current);

  const updateState = useCallback((state: Partial<SocketState>) => {
    stateRef.current = {
      ...stateRef.current,
      ...state,
    };

    setValue((prev) => ({
      ...prev,
      ...state,
    }));
  }, []);

  const disconnectSocket = useCallback(() => {
    if (stateRef.current.connecting) {
      updateState({ connecting: false });
    }

    socket.disconnect();
    socket.close();
  }, [updateState]);

  useLayoutEffect(() => {
    if (!devId) {
      return;
    }

    setAxiosInterceptors({
      devId,
      accessToken: tokens.access,
      languageCode: lang,
      onUnauthorized,
      onNoRespond,
      refreshTokens,
    });

    if (tokens.access) {
      updateState({ connecting: true });

      socket.io.opts.query = {
        ...(Platform.OS !== 'web'
          ? { [authTokenHeaderKey.refresh]: tokens.refresh }
          : {}),
        lang,
      };
      socket.connect();
    } else {
      disconnectSocket();
    }

    return () => {
      disconnectSocket();
    };
  }, [
    tokens,
    lang,
    devId,
    disconnectSocket,
    updateState,
    onNoRespond,
    onUnauthorized,
    setTokens,
    refreshTokens,
  ]);

  useLayoutEffect(() => {
    socket.on('connect', () => {
      updateState({
        connecting: false,
        connected: socket.connected,
        connectError: undefined,
      });
    });
    socket.on('disconnect', () => {
      updateState({
        connecting: false,
        connected: socket.connected,
      });
    });
    socket.on('connect_error', (reason) => {
      updateState({
        connecting: false,
        connected: socket.connected,
        connectError: reason,
      });
    });
  }, [updateState]);

  useLayoutEffect(() => {
    if (value.connected) {
      onConnected?.();
    }
  }, [value.connected, onConnected]);

  return (
    <QueryClientProvider client={queryClient}>
      <ApiContext.Provider value={{}}>{devId && children}</ApiContext.Provider>
    </QueryClientProvider>
  );
};
