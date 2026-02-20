import { RefreshControl, RefreshControlProps } from 'react-native';
import { emitHaptic, isIos } from '@symbiot-core-apps/shared';
import { useCallback } from 'react';

export const Refresher = ({ onRefresh, ...props }: RefreshControlProps) => {
  const refresh = useCallback(() => {
    emitHaptic();
    onRefresh?.();
  }, [onRefresh]);

  return (
    <RefreshControl
      // eslint-disable-next-line
      // @ts-ignore
      size={isIos ? 20 : undefined} // fixes old issue
      onRefresh={refresh}
      {...props}
    />
  );
};
