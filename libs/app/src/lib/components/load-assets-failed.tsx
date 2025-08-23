import { Text, View } from 'react-native';
import { Image } from 'expo-image';

export const LoadAssetsFailed = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
      }}
    >
      <Image
        source={require('../assets/configure.png')}
        style={{ width: 200, height: 200 }}
      />

      <Text style={{ textAlign: 'center', fontSize: 20 }}>Setup processing...</Text>
    </View>
  );
};
