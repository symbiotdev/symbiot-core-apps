import {
  ComponentClass,
  ComponentType,
  forwardRef,
  PropsWithChildren,
} from 'react';
import {
  ComponentProps,
  Props,
  useComponentProps,
} from '../hooks/use-component-props';
import { AnimatedProps } from 'react-native-reanimated';

export function themed<C extends ComponentProps<C>>(
  Component:
    | ComponentType<PropsWithChildren<Record<string, unknown>>>
    | ComponentClass<AnimatedProps<object>>,
  defProps?: Partial<Props<C>>,
) {
  return forwardRef<ComponentType, PropsWithChildren<Props<C>>>(
    (refProps, ref) => {
      const { children, ...restProps } = refProps as Props<C> &
        PropsWithChildren;
      const props = useComponentProps({
        ...defProps,
        ...restProps,
      } as Partial<Props<C>>);

      return <Component {...props} ref={ref} children={children} />;
    },
  );
}
