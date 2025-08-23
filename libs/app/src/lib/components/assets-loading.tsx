import { ActivityIndicator, View } from 'react-native';

export const AssetsLoading = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="small" animating={true} />
    </View>
  );
};
