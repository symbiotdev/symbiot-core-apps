import { useCallback, useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardEventName,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const hideEvent: KeyboardEventName =
  Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

export const useKeyboard = () => {
  const { height } = useWindowDimensions();
  const { bottom } = useSafeAreaInsets();

  const [shown, setShown] = useState(false);
  const [currentHeight, setCurrentHeight] = useState(0);
  const [keyboardHeight, setKeyboardHeight] = useState(
    bottom + (Platform.OS === 'ios' ? 300 : height * 0.4),
  );
  useEffect(() => {
    const willShowSubscription = Keyboard.addListener(
      'keyboardWillShow',
      (e) => {
        const height = e.endCoordinates.height;

        if (height) {
          setKeyboardHeight(e.endCoordinates.height);
          setCurrentHeight(e.endCoordinates.height);
        }

        setShown(true);
      },
    );
    const didShowSubscription = Keyboard.addListener('keyboardDidShow', (e) => {
      const height = e.endCoordinates.height;

      if (height !== keyboardHeight) {
        setCurrentHeight(height);
        setKeyboardHeight(height);
      }

      if (Platform.OS === 'android') {
        setShown(true);
      }
    });
    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      setShown(false);
      setCurrentHeight(0);
    });

    return () => {
      willShowSubscription.remove();
      didShowSubscription.remove();
      hideSubscription.remove();
    };
  }, [keyboardHeight]);

  return {
    shown,
    keyboardHeight,
    currentHeight,
  };
};

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
        isKeyboardVisible ? (Platform.OS === 'ios' ? 100 : 200) : 0,
      );
    },
    [callback],
  );
}
