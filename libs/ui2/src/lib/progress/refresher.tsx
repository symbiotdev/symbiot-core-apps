import { RefreshControl, RefreshControlProps } from 'react-native';
import { emitHaptic } from '@symbiot-core-apps/shared';
import { useCallback } from 'react';

export const Refresher = ({ onRefresh, ...props }: RefreshControlProps) => {
  const refresh = useCallback(() => {
    emitHaptic();
    onRefresh?.();
  }, [onRefresh]);

  return <RefreshControl {...props} onRefresh={refresh} />;
};
