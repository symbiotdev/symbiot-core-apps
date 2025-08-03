import axios, {
  AxiosResponse,
  Canceler,
  InternalAxiosRequestConfig,
} from 'axios';
import { DeviceInfo, DeviceVersion } from '@symbiot-core-apps/shared';
import { Platform } from 'react-native';
import { RequestError } from './request';
import { AccountAuthTokens } from '../types/account-auth';
import { authTokenHeaderKey } from '../hooks/use-auth-tokens';

export type InterceptorParams = {
  devId: string;
  accessToken?: string | null;
  languageCode: string;
  onNoRespond: () => void;
  onUnauthorized: () => void;
  refreshTokens: () => Promise<AccountAuthTokens>;
};

const cancelableRequests = new Map<string, Canceler>();

export const setAxiosInterceptors = (params: InterceptorParams) => {
  axios.interceptors.request.clear();
  axios.interceptors.request.use((request) => onRequest(request, params));

  axios.interceptors.response.clear();
  axios.interceptors.response.use(
    (response) => onSuccessResponse(response),
    ({ response, config }) => onErrorResponse(response, config, params),
  );
};

const getRequestKey = (config: InternalAxiosRequestConfig) => {
  const { method, url } = config;
  return `${method}-${url}`;
};

const onRequest = async (
  config: InternalAxiosRequestConfig,
  params: InterceptorParams,
) => {
  let requestUrl = '';

  if (config.url?.indexOf('/api/') === 0 || config.url?.indexOf('api/') === 0) {
    requestUrl = config.url.replace(/^(\/api\/|api\/)/, '');
  }

  if (requestUrl) {
    config.url = `${process.env.EXPO_PUBLIC_API_URL}/api/${requestUrl}`;
  }

  if (Platform.OS === 'web') {
    config.withCredentials = true;
  }

  if (config.data instanceof FormData) {
    config.headers['Content-Type'] = 'multipart/form-data';
    config.transformRequest = (formData) => formData;
  }

  if (!config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json';
  }

  if (
    Platform.OS !== 'web' &&
    params.accessToken &&
    !config.headers[authTokenHeaderKey.access]
  ) {
    config.headers[authTokenHeaderKey.access] = params.accessToken;
  }

  if (!config.headers['Timezone']) {
    config.headers['Timezone'] =
      Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  config.headers['x-app'] = process.env['EXPO_PUBLIC_APP_TYPE'];
  config.headers['x-identifier'] = params.devId;
  config.headers['x-lang'] = params.languageCode;
  config.headers['x-version'] = DeviceVersion;
  config.headers['x-platform'] = Platform.OS;
  config.headers['x-device-info'] = JSON.stringify(DeviceInfo);

  if (config.headers['cancelable']) {
    const requestKey = getRequestKey(config);

    if (cancelableRequests.has(requestKey)) {
      cancelableRequests.get(requestKey)?.('', config);
      cancelableRequests.delete(requestKey);
    }

    const cancelTokenSource = axios.CancelToken.source();

    config.cancelToken = cancelTokenSource.token;
    cancelableRequests.set(requestKey, cancelTokenSource.cancel);

    config.headers['cancelable'] = undefined;
  }

  return config;
};

const onSuccessResponse = (response: AxiosResponse) => {
  const config = response.config as InternalAxiosRequestConfig;
  const requestKey = getRequestKey(config);

  cancelableRequests.delete(requestKey);

  return response.data;
};

const onErrorResponse = async (
  response: {
    data: {
      error?: string;
      message?: string;
      title?: string;
    };
    status: number;
    statusText?: string;
  },
  requestConfig: InternalAxiosRequestConfig & { _retry: boolean },
  params: InterceptorParams,
) => {
  if (!response) {
    throw new Error(undefined);
  }

  const text =
    response?.data?.title ||
    response.data?.error ||
    response.data?.message ||
    '';
  const error: RequestError = { code: response.status, text };

  const requestKey = getRequestKey(requestConfig);

  cancelableRequests.delete(requestKey);

  if (response.status === 0) {
    params.onNoRespond();
  } else if (response.status === 401) {
    try {
      const { access } = await params.refreshTokens();

      return axios.request({
        ...requestConfig,
        headers: {
          ...requestConfig.headers,
          [authTokenHeaderKey.access]: access,
        },
      });
    } catch {
      params.onUnauthorized();
    }
  }

  throw error;
};
