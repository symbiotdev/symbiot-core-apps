import { Stack } from 'expo-router';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenOptions = {
  headerBackButtonDisplayMode: 'minimal',
  animation: 'simple_push',
  customAnimationOnGesture: true,
  headerShadowVisible: false,
  headerTitle: '',
  headerStyle: {
    backgroundColor: 'transparent',
  },
} as NativeStackNavigationOptions;

AsyncStorage.clear();

export default () => {
  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen
        name="auth"
        options={{ headerShown: false, animation: 'none' }}
      />
    </Stack>
  );
};
