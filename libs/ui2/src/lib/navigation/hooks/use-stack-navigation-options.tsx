import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { isAndroid, useScreenOrientation } from '@symbiot-core-apps/shared';
import { useCallback } from 'react';
import {
  NativeStackHeaderProps,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import { Header } from '../header';
import { useHeaderHeight } from './use-header-height';

export const useStackNavigationOptions = () => {
  const { top, left, right } = useSafeAreaInsets();
  const { orientationFormat } = useScreenOrientation();
  const headerHeight = useHeaderHeight();

  return {
    headerTransparent: true,
    ...(isAndroid && {
      animation: 'slide_from_right',
    }),
    header: useCallback(
      (props: NativeStackHeaderProps) => (
        <Header
          {...props}
          top={top + (orientationFormat === 'landscape' ? 10 : 0)}
          left={left}
          right={right}
          height={headerHeight}
        />
      ),
      [left, right, top, headerHeight, orientationFormat],
    ),
  } as NativeStackNavigationOptions;
};
