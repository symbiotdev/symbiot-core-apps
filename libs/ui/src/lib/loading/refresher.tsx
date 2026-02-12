import { RefreshControl, RefreshControlProps } from 'react-native';
import { emitHaptic, isIos } from '@symbiot-core-apps/shared';
import { useCallback } from 'react';

export const Refresher = (props: RefreshControlProps) => {
  const { onRefresh } = props;
  const refresh = useCallback(() => {
    emitHaptic();

    onRefresh?.();
  }, [onRefresh]);

  return (
    <RefreshControl
      size={isIos ? 20 : undefined}
      onRefresh={refresh}
      {...props}
    />
  );
};
