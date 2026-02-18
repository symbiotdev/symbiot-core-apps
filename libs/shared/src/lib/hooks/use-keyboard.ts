import { useCallback } from 'react';
import { Keyboard } from 'react-native';
import { isIos } from '../utils/device';

export function useKeyboardDismisser<
  T extends (...args: Parameters<T>) => void,
>(callback: T): (...args: Parameters<T>) => void {
  return useCallback(
    (...args: Parameters<T>) => {
      const isKeyboardVisible = Keyboard.isVisible?.(); // Optional chaining in case it's custom

      if (isKeyboardVisible) {
        Keyboard.dismiss();
      }

      setTimeout(
        () => callback(...args),
        isKeyboardVisible ? (isIos ? 100 : 300) : 0,
      );
    },
    [callback],
  );
}
