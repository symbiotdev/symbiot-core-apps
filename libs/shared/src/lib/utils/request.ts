export type RequestError = {
  code: number;
  text: string;
}

const defaultError = 'Unknown error';

export const getRequestErrorMessage = (error: unknown) => {
  if (typeof error === 'object') {
    return (error as RequestError)?.text || defaultError;
  }

  return defaultError;
};

