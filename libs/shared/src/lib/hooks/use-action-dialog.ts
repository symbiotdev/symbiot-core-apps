import { useCallback, useState } from 'react';
import { getRequestErrorMessage } from '../utils/request';

export function useActionDialog<P>({
  action$,
}: {
  action$: (params: P) => Promise<unknown>;
}) {
  const [dialogOpened, setDialogOpened] = useState(false);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [dialogError, setDialogError] = useState<string>();

  const clearDialogError = useCallback(() => setDialogError(undefined), []);

  const openDialog = useCallback(() => setDialogOpened(true), []);

  const closeDialog = useCallback(() => {
    setDialogOpened(false);
    clearDialogError();
  }, [clearDialogError]);

  const triggerDialogAction = useCallback(
    async (params: P) => {
      setDialogLoading(true);
      clearDialogError();

      try {
        await action$(params);
        closeDialog();
      } catch (error) {
        setDialogError(getRequestErrorMessage(error));
      } finally {
        setDialogLoading(false);
      }
    },
    [action$, clearDialogError, closeDialog],
  );

  return {
    dialogOpened,
    dialogError,
    dialogLoading,
    clearDialogError,
    openDialog,
    closeDialog,
    triggerDialogAction,
  };
}
