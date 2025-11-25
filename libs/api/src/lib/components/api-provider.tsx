import { setAxiosInterceptors } from '../utils/axios-interceptors';
import { PropsWithChildren, useEffect, useLayoutEffect, useState } from 'react';
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
  onUnauthorized,
  onNoRespond,
}: PropsWithChildren<{
  onNoRespond: () => void;
  onUnauthorized: () => void;
}>) => {
  const devId = useDevId();
  const { now } = useNativeNow();
  const { i18n } = useTranslation();
  const { tokens, nextRefreshDate } = useAuthTokens();
  const refreshTokens = useAccountAuthRefreshTokenReq();

  const [interceptorDefined, setInterceptorDefined] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [socketState, setSocketState] = useState<SocketState>({
    connecting: false,
    connected: false,
    connectError: undefined,
  });

  useLayoutEffect(() => {
    if (!devId || !tokens) return;

    setAxiosInterceptors({
      devId,
      accessToken: tokens.access,
      languageCode: i18n.language,
      onUnauthorized,
      onNoRespond,
    });

    setInterceptorDefined(true);
  }, [devId, i18n.language, onNoRespond, onUnauthorized, tokens]);

  useLayoutEffect(() => {
    if (!interceptorDefined) return;

    if (tokens.access) {
      setSocketState((prev) => ({
        ...prev,
        connecting: true,
      }));

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
    }

    return () => {
      socket.disconnect();
      socket.close();

      setSocketState((prev) => ({
        ...prev,
        connecting: false,
        connected: false,
        connectError: undefined,
      }));
    };
  }, [i18n.language, interceptorDefined, tokens]);

  useLayoutEffect(() => {
    socket.on('connect', () => {
      setSocketState((prev) => ({
        ...prev,
        connecting: false,
        connected: socket.connected,
        connectError: undefined,
      }));
    });
    socket.on('disconnect', () => {
      setSocketState((prev) => ({
        ...prev,
        connecting: false,
        connected: socket.connected,
      }));
    });
    socket.on('connect_error', (reason) => {
      setSocketState((prev) => ({
        ...prev,
        connecting: false,
        connected: socket.connected,
        connectError: reason,
      }));
    });
  }, []);

  useEffect(() => {
    if (!interceptorDefined) return;

    if (
      nextRefreshDate &&
      (DateHelper.isAfter(now, nextRefreshDate) ||
        DateHelper.isSame(now, nextRefreshDate))
    ) {
      refreshTokens().finally(() => setLoaded(true));
    } else {
      setLoaded(true);
    }
  }, [interceptorDefined, nextRefreshDate, now, refreshTokens]);

  return (
    <QueryClientProvider client={queryClient}>
      {loaded && children}
    </QueryClientProvider>
  );
};
