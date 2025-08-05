import { Platform } from 'react-native';
import {
  AndroidHaptics,
  performAndroidHapticsAsync,
  selectionAsync,
} from 'expo-haptics';

export const emitHaptic = () => {
  if (Platform.OS === 'android') {
    void performAndroidHapticsAsync(AndroidHaptics.Virtual_Key);
  } else {
    void selectionAsync();
  }
};
