import { useCallback, useState } from 'react';
import { getRequestErrorMessage } from '../utils/request';
import { ShowNativeFailedAlert } from '../utils/burnt';

export function useApiLoader<P>({
  showAlertError,
  api$,
}: {
  showAlertError?: boolean;
  api$: (params: P) => Promise<unknown>;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const trigger$ = useCallback(
    async (params: P) => {
      setLoading(true);
      setError(undefined);

      try {
        await api$(params);
      } catch (error) {
        const errorText = getRequestErrorMessage(error);

        setError(errorText);

        if (showAlertError) {
          ShowNativeFailedAlert({
            text: errorText,
          });
        }

        throw errorText;
      } finally {
        setLoading(false);
      }
    },
    [api$, showAlertError],
  );

  return {
    trigger$,
    loading,
    error,
  };
}
