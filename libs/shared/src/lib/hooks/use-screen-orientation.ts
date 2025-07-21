import { useEffect, useState } from 'react';
import {
  addOrientationChangeListener,
  getOrientationAsync,
  Orientation,
  removeOrientationChangeListener,
} from 'expo-screen-orientation';

export const useScreenOrientation = () => {
  const [orientation, setOrientation] = useState<Orientation>();

  useEffect(() => {
    const getOrientation = async () => {
      setOrientation(await getOrientationAsync());
    };

    const subscription = addOrientationChangeListener((event) => {
      setOrientation(event.orientationInfo.orientation);
    });

    void getOrientation();

    return () => {
      removeOrientationChangeListener(subscription);
    };
  }, []);

  return { orientation };
};
