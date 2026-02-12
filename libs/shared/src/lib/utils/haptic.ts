import {
  AndroidHaptics,
  performAndroidHapticsAsync,
  selectionAsync,
} from 'expo-haptics';
import { isAndroid } from './device';

export const emitHaptic = () => {
  if (isAndroid) {
    void performAndroidHapticsAsync(AndroidHaptics.Virtual_Key);
  } else {
    void selectionAsync();
  }
};
