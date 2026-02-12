import { useEffect, useState } from 'react';
import {
  addOrientationChangeListener,
  getOrientationAsync,
  Orientation,
  removeOrientationChangeListener,
  WebOrientationLock,
} from 'expo-screen-orientation';
import { InteractionManager } from 'react-native';

type OrientationFormat = 'landscape' | 'portrait';

const defaultOrientation: OrientationFormat = 'portrait'; // could be changed to default

const format: Record<Orientation | WebOrientationLock, OrientationFormat> = {
  [Orientation.UNKNOWN]: defaultOrientation,
  [Orientation.PORTRAIT_DOWN]: 'portrait',
  [Orientation.PORTRAIT_UP]: 'portrait',
  [Orientation.LANDSCAPE_LEFT]: 'landscape',
  [Orientation.LANDSCAPE_RIGHT]: 'landscape',
  [WebOrientationLock.ANY]: 'portrait',
  [WebOrientationLock.NATURAL]: 'portrait',
  [WebOrientationLock.UNKNOWN]: 'portrait',
  [WebOrientationLock.PORTRAIT]: 'portrait',
  [WebOrientationLock.PORTRAIT_PRIMARY]: 'portrait',
  [WebOrientationLock.PORTRAIT_SECONDARY]: 'portrait',
  [WebOrientationLock.LANDSCAPE]: 'landscape',
  [WebOrientationLock.LANDSCAPE_SECONDARY]: 'landscape',
  [WebOrientationLock.LANDSCAPE_PRIMARY]: 'landscape',
};

export const useScreenOrientation = ({
  onBeforeChange,
  onChanged,
}: { onBeforeChange?: () => void; onChanged?: () => void } = {}) => {
  const [orientation, setOrientation] = useState<Orientation>();

  useEffect(() => {
    const subscription = addOrientationChangeListener((event) => {
      setOrientation(event.orientationInfo.orientation);

      onBeforeChange?.();

      InteractionManager.runAfterInteractions(() => {
        onChanged?.();
      });
    });

    getOrientationAsync().then(
      (orientation) => orientation && setOrientation(orientation),
    );

    return () => {
      removeOrientationChangeListener(subscription);
    };
  }, [onBeforeChange, onChanged]);

  return {
    orientation,
    orientationFormat: orientation ? format[orientation] : defaultOrientation,
  };
};
