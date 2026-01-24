import { setAxiosInterceptors } from '../utils/axios-interceptors';
import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import socket from '../utils/socket';
import { authTokenHeaderKey, useAuthTokens } from '../hooks/use-auth-tokens';
import { useDevId } from '../hooks/use-dev-id';
import { onlineManager, QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../utils/client';
import { Platform } from 'react-native';
import { clearInitialQueryData } from '../utils/initial-query-data';
import { DateHelper, useAppState, useI18n } from '@symbiot-core-apps/shared';
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
  const { appState } = useAppState();
  const { lang } = useI18n();
  const { tokens, accessToDate } = useAuthTokens();
  const refreshTokens = useAccountAuthRefreshTokenReq();

  const areTokensRefreshingRef = useRef(false);

  const [authChecked, setAuthChecked] = useState(false);
  const [apiConfigured, setApiConfigured] = useState(false);
  const [socketState, setSocketState] = useState<SocketState>({
    connecting: false,
    connected: false,
    connectError: undefined,
  });

  const refreshTokensIfRequired = useCallback(async () => {
    if (areTokensRefreshingRef.current) return;

    const now = new Date();

    if (
      accessToDate &&
      (DateHelper.isAfter(now, accessToDate) ||
        DateHelper.isSame(now, accessToDate))
    ) {
      areTokensRefreshingRef.current = true;

      try {
        await refreshTokens();
      } finally {
        areTokensRefreshingRef.current = false;
      }
    }

    setAuthChecked(true);
  }, [accessToDate, refreshTokens]);

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

  useLayoutEffect(() => {
    if (!devId) return;

    setAxiosInterceptors({
      devId,
      accessToken: tokens.access,
      languageCode: lang,
      onUnauthorized,
      onNoRespond,
    });

    if (tokens.access) {
      setSocketState((prev) => ({
        ...prev,
        connecting: true,
      }));

      socket.io.opts.query = {
        ...(Platform.OS !== 'web'
          ? { [authTokenHeaderKey.refresh]: tokens.refresh }
          : {}),
        lang,
      };

      socket.connect();
    } else {
      queryClient.clear();
      clearInitialQueryData();
    }

    setApiConfigured(true);

    return () => {
      socket.disconnect();
      socket.close();
    };
  }, [devId, lang, onNoRespond, onUnauthorized, tokens.access, tokens.refresh]);

  useEffect(() => {
    if (!apiConfigured) return;

    let timeout: NodeJS.Timeout;

    if (appState !== 'active') {
      onlineManager.setOnline(false);
    } else {
      const refetch = () => {
        refreshTokensIfRequired().finally(() => onlineManager.setOnline(true));
      };

      timeout = setInterval(refetch, 60 * 1000);

      refetch();
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [appState, apiConfigured, refreshTokensIfRequired]);

  return (
    <QueryClientProvider client={queryClient}>
      {authChecked && children}
    </QueryClientProvider>
  );
};
