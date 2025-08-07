import { View, ViewProps } from 'tamagui';
import { isDeviceSlow, useRendered } from '@symbiot-core-apps/shared';
import { LoadingView } from './loading-view';
import { ReactElement } from 'react';

const defaultDelay = isDeviceSlow() ? 300 : 0;

export type ContainerViewProps = ViewProps & {
  lazy?: boolean;
  delay?: number;
  LoadingElement?: ReactElement;
};

export const ContainerView = ({
  lazy,
  delay,
  LoadingElement,
  ...viewProps
}: ContainerViewProps) => {
  const { rendered } = useRendered({
    defaultTrue: lazy === false,
    delay: delay || defaultDelay,
  });

  if (!rendered) {
    return LoadingElement || <LoadingView />;
  }

  return (
    rendered && (
      <View
        maxWidth={1280}
        width="100%"
        marginHorizontal="auto"
        {...viewProps}
      />
    )
  );
};
