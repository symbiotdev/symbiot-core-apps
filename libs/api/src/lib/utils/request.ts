import { ShowNativeFailedAlert } from '@symbiot-core-apps/shared';

export type RequestError = {
  code: number;
  text: string;
};

const defaultError = 'Unknown error';

export const getRequestErrorMessage = (error: unknown) => {
  if (error && typeof error === 'object') {
    return (error as RequestError)?.text || defaultError;
  } else if (error) {
    return defaultError;
  }

  return undefined;
};

export async function requestWithStringError<T>(
  request: Promise<T>,
): Promise<T> {
  try {
    return await request;
  } catch (error) {
    throw getRequestErrorMessage(error) || '';
  }
}

export async function requestWithAlertOnError<T>(
  request: Promise<T>,
): Promise<T> {
  try {
    return await requestWithStringError(request);
  } catch (error) {
    ShowNativeFailedAlert({
      text: error as string,
    });

    throw getRequestErrorMessage(error) || '';
  }
}
