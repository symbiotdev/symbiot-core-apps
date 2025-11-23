import { setAxiosInterceptors } from '../utils/axios-interceptors';
import {
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
import { Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { clearInitialQueryData } from '../utils/initial-query-data';
import { DateHelper, useNativeNow } from '@symbiot-core-apps/shared';
import { useAccountAuthRefreshTokenReq } from '../queries/use-account-auth.api';

type SocketState = {
  connecting: boolean;
  connected: boolean;
  connectError: Error | undefined;
};

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
  const { now } = useNativeNow();
  const { i18n } = useTranslation();
  const { tokens, nextRefreshDate, setTokens } = useAuthTokens();
  const refreshTokens = useAccountAuthRefreshTokenReq();

  const [loaded, setLoaded] = useState(false);

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
      languageCode: i18n.language,
      onUnauthorized,
      onNoRespond,
    });

    if (tokens.access) {
      updateState({ connecting: true });

      socket.io.opts.query = {
        ...(Platform.OS !== 'web'
          ? { [authTokenHeaderKey.refresh]: tokens.refresh }
          : {}),
        lang: i18n.language,
      };
      socket.connect();
    } else {
      queryClient.clear();
      clearInitialQueryData();
      disconnectSocket();
    }

    return () => {
      disconnectSocket();
    };
  }, [
    tokens,
    i18n.language,
    devId,
    disconnectSocket,
    updateState,
    onNoRespond,
    onUnauthorized,
    setTokens,
  ]);

  useLayoutEffect(() => {
    if (!devId) {
      return;
    }

    if (
      nextRefreshDate &&
      (DateHelper.isAfter(now, nextRefreshDate) ||
        DateHelper.isSame(now, nextRefreshDate))
    ) {
      void refreshTokens();
    } else {
      setLoaded(true);
    }
  }, [devId, nextRefreshDate, now, refreshTokens]);

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
      {loaded && children}
    </QueryClientProvider>
  );
};
