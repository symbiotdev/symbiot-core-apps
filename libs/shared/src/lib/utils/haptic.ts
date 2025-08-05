import { Platform } from 'react-native';
import {
  AndroidHaptics,
  performAndroidHapticsAsync,
  selectionAsync,
} from 'expo-haptics';

export const emitHaptic = () => {
  if (Platform.OS === 'android') {
    void performAndroidHapticsAsync(AndroidHaptics.Keyboard_Tap);
  } else {
    void selectionAsync();
  }
};
