import {
  ComponentClass,
  ComponentType,
  forwardRef,
  PropsWithChildren,
} from 'react';
import { Props, useComponentProps } from '../hooks/use-component-props';
import { AnimatedProps } from 'react-native-reanimated';
import { ViewProps } from 'react-native';

export function themed<P extends ViewProps | AnimatedProps<ViewProps>>(
  Component:
    | ComponentType<PropsWithChildren<Record<string, unknown>>>
    | ComponentClass<AnimatedProps<object>>,
  defProps?: Partial<Props<P>>,
) {
  return forwardRef<ComponentType, PropsWithChildren<Props<P>>>(
    (refProps, ref) => {
      const { children, ...restProps } = refProps as Props<P> &
        PropsWithChildren;
      const props = useComponentProps({
        ...defProps,
        ...restProps,
      } as Partial<Props<ViewProps>>);

      return <Component {...props} ref={ref} children={children} />;
    },
  );
}
