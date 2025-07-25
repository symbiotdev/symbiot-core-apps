import { useEffect, useState } from 'react';
import {
  addOrientationChangeListener,
  getOrientationAsync,
  Orientation,
  removeOrientationChangeListener,
} from 'expo-screen-orientation';
import { InteractionManager } from 'react-native';

export const useScreenOrientation = ({
  onBeforeChange,
  onChanged,
}: { onBeforeChange?: () => void; onChanged?: () => void } = {}) => {
  const [orientation, setOrientation] = useState<Orientation>();

  useEffect(() => {
    const getOrientation = async () => {
      setOrientation(await getOrientationAsync());
    };

    const subscription = addOrientationChangeListener((event) => {
      setOrientation(event.orientationInfo.orientation);

      onBeforeChange?.();

      InteractionManager.runAfterInteractions(() => {
        onChanged?.();
      });
    });

    void getOrientation();

    return () => {
      removeOrientationChangeListener(subscription);
    };
  }, [onBeforeChange, onChanged]);

  return { orientation };
};
