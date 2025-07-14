import { Platform } from 'react-native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';

export const authStackScreenOptions = {
  headerBackButtonDisplayMode: 'minimal',
  animation: 'slide_from_right',
  customAnimationOnGesture: true,
  headerShadowVisible: false,
  headerShown: Platform.OS !== 'web',
  headerTitle: '',
} as NativeStackNavigationOptions;
