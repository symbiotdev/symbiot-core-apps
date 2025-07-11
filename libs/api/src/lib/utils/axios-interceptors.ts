import axios, {
  AxiosResponse,
  Canceler,
  InternalAxiosRequestConfig,
} from 'axios';
import {
  DeviceInfo,
  DeviceVersion,
  RequestError,
} from '@symbiot-core-apps/shared';

export type InterceptorParams = {
  devId: string;
  authToken?: string;
  languageCode: string;
  onNoRespond: () => void;
  onUnauthorized: () => void;
};

const cancelableRequests = new Map<string, Canceler>();

export const setAxiosInterceptors = (params: InterceptorParams) => {
  axios.interceptors.request.clear();
  axios.interceptors.request.use((request) => onRequest(request, params));

  axios.interceptors.response.clear();
  axios.interceptors.response.use(
    (response) => onSuccessResponse(response),
    ({ response, config }) => onErrorResponse(response, config, params)
  );
};

const getRequestKey = (config: InternalAxiosRequestConfig) => {
  const { method, url } = config;
  return `${method}-${url}`;
};

const onRequest = async (
  config: InternalAxiosRequestConfig,
  params: InterceptorParams
) => {
  let requestUrl = '';

  if (config.url?.indexOf('/api/') === 0 || config.url?.indexOf('api/') === 0) {
    requestUrl = config.url.replace(/^(\/api\/|api\/)/, '');
  }

  if (requestUrl) {
    config.url = `${process.env.EXPO_PUBLIC_API_URL}/api/${requestUrl}`;
  }

  if (config.data instanceof FormData) {
    config.headers['Content-Type'] = 'multipart/form-data';
    config.transformRequest = (formData) => formData;
  }

  if (!config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json';
  }

  if (params.authToken) {
    config.headers['Authorization'] = `Bearer ${params.authToken}`;
  }

  if (!config.headers['Timezone']) {
    config.headers['Timezone'] =
      Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  config.headers['identifier'] = params.devId;
  config.headers['lang'] = params.languageCode;
  config.headers['app'] = process.env.EXPO_PUBLIC_APP;
  config.headers['version'] = DeviceVersion;
  config.headers['device-info'] = JSON.stringify(DeviceInfo);

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

const onErrorResponse = (
  response: {
    data: {
      error?: string;
      message?: string;
      title?: string;
    };
    status: number;
    statusText?: string;
  },
  config: InternalAxiosRequestConfig,
  params: InterceptorParams
) => {
  if (!response) {
    throw undefined;
  }

  const text =
    response?.data?.title ||
    response.data?.error ||
    response.data?.message ||
    '';
  const error: RequestError = { code: response.status, text };

  const requestKey = getRequestKey(config);

  cancelableRequests.delete(requestKey);

  if (response.status === 0) {
    params.onNoRespond();
  }

  if (response.status === 401) {
    params.onUnauthorized();
  }

  throw error;
};
