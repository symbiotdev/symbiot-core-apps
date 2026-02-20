import { View, ViewProps } from 'tamagui';
import { isDeviceSlow, useRendered } from '@symbiot-core-apps/shared';
import { ReactElement, useCallback, useRef } from 'react';
import { LoadingContainer } from '@symbiot-core-apps/ui2';

const defaultDelay = isDeviceSlow() ? 300 : 0;

export type ContainerViewProps = ViewProps & {
  lazy?: boolean;
  delay?: number;
  LoadingElement?: ReactElement;
  onRendered?: () => void;
};

export const ContainerView = ({
  lazy,
  delay,
  LoadingElement,
  onRendered,
  ...viewProps
}: ContainerViewProps) => {
  const { rendered } = useRendered({
    defaultTrue: lazy === false,
    delay: delay || defaultDelay,
  });

  const renderedRef = useRef(false);

  const onLayout = useCallback(() => {
    if (renderedRef.current) {
      return;
    }

    renderedRef.current = true;

    onRendered?.();
  }, [onRendered]);

  if (!rendered) {
    return LoadingElement || <LoadingContainer />;
  }

  return (
    rendered && (
      <View
        maxWidth={1280}
        width="100%"
        marginHorizontal="auto"
        onLayout={onLayout}
        {...viewProps}
      />
    )
  );
};
