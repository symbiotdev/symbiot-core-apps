import { Platform } from 'react-native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';

export const authStackScreenOptions: NativeStackNavigationOptions = {
  headerBackButtonDisplayMode: 'minimal',
  animation: 'slide_from_right',
  headerShadowVisible: false,
  headerShown: Platform.OS !== 'web',
  headerTitle: '',
};
