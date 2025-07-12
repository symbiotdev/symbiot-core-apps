import { selectionAsync } from 'expo-haptics';
import { Platform, RefreshControl, RefreshControlProps } from 'react-native';

export const Refresher = (props: RefreshControlProps) => {
  const { onRefresh } = props;
  const refresh = () => {
    selectionAsync();

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
