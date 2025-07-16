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
