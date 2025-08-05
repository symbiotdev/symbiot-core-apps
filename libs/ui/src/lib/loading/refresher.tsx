import { Platform, RefreshControl, RefreshControlProps } from 'react-native';
import { emitHaptic } from '@symbiot-core-apps/shared';

export const Refresher = (props: RefreshControlProps) => {
  const { onRefresh } = props;
  const refresh = () => {
    emitHaptic();

    onRefresh?.();
  };

  return (
    <RefreshControl
      size={Platform.OS === 'ios' ? 20 : undefined}
      onRefresh={refresh}
      {...props}
    />
  );
};
