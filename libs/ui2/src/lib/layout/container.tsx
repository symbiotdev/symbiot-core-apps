import { LayoutChangeEvent, View, ViewProps } from 'react-native';
import { isDeviceSlow, useRendered } from '@symbiot-core-apps/shared';
import { ReactElement, useCallback, useRef } from 'react';
import { LoadingContainer } from '../progress/loading-container';

export type ContainerProps = ViewProps & {
  lazy?: boolean;
  LoadingElement?: ReactElement;
  onRendered?: () => void;
};

const delay = isDeviceSlow() ? 300 : 0;

export const Container = ({
  lazy,
  style,
  LoadingElement,
  onLayout,
  onRendered,
  ...props
}: ContainerProps) => {
  const { rendered } = useRendered({
    defaultTrue: lazy === false,
    delay,
  });

  const renderedRef = useRef(false);

  const _onLayout = useCallback(
    (e: LayoutChangeEvent) => {
      onLayout?.(e);

      if (!renderedRef.current) {
        renderedRef.current = true;
        onRendered?.();
      }
    },
    [onLayout, onRendered],
  );

  if (!rendered) {
    return LoadingElement ?? <LoadingContainer />;
  }

  return (
    <View
      {...props}
      style={[{ alignSelf: 'center', width: '100%', maxWidth: 1200 }, style]}
      onLayout={_onLayout}
    />
  );
};
