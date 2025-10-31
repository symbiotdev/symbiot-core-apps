import { Platform, RefreshControl, RefreshControlProps } from 'react-native';
import { emitHaptic } from '@symbiot-core-apps/shared';
import { useCallback } from 'react';

export const Refresher = (props: RefreshControlProps) => {
  const { onRefresh } = props;
  const refresh = useCallback(() => {
    emitHaptic();

    onRefresh?.();
  }, [onRefresh]);

  return (
    <RefreshControl
      size={Platform.OS === 'ios' ? 20 : undefined}
      onRefresh={refresh}
      {...props}
    />
  );
};
