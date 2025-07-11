import {
  InterceptorParams,
  setAxiosInterceptors,
} from '../utils/axios-interceptors';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useLayoutEffect,
  useState,
} from 'react';
import socket from '../utils/socket';

export type ApiProviderProps = InterceptorParams & {
  onConnected?: () => void;
};

const ApiContext = createContext<
  | {
      connecting: boolean;
      connected: boolean;
      connectError: Error | undefined;
    }
  | undefined
>(undefined);

export const ApiProvider = (props: PropsWithChildren<ApiProviderProps>) => {
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [connectError, setConnectedError] = useState<Error>();

  const disconnectSocket = useCallback(() => {
    if (connecting) {
      setConnecting(false);
    }

    socket.disconnect();
    socket.close();
  }, [connecting]);

  useLayoutEffect(() => {
    setAxiosInterceptors(props);

    if (props.authToken) {
      setConnecting(true);

      socket.disconnect();
      socket.io.opts.query = {
        token: props.authToken,
        lang: props.languageCode,
      };
      socket.connect();
    } else {
      disconnectSocket();
    }

    return () => {
      disconnectSocket();
    };
  }, [props.authToken, props.languageCode]);

  useLayoutEffect(() => {
    if (connected) {
      props.onConnected?.();
    }
  }, [connected, props.onConnected]);

  useLayoutEffect(() => {
    socket.on('connect', () => {
      setConnectedError(undefined);
      setConnected(socket.connected);
      setConnecting(false);
    });
    socket.on('disconnect', () => {
      setConnected(socket.connected);
      setConnecting(false);
    });
    socket.on('connect_error', (reason) => {
      setConnectedError(reason);
      setConnecting(false);
    });
  }, []);

  return (
    <ApiContext.Provider
      value={{
        connecting,
        connected,
        connectError,
      }}
    >
      {props.children}
    </ApiContext.Provider>
  );
};
