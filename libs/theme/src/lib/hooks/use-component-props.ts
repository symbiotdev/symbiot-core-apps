import { DimensionValue, ViewProps, ViewStyle } from 'react-native';
import { useMemo, useState } from 'react';
import {
  allStyleProps,
  colorStyleProps,
  dimensionStyleProps,
} from '../utils/style-props';
import { AnimatedProps } from 'react-native-reanimated';
import { useTheme } from './use-theme';

type OverrideStyle<T> = {
  [K in keyof T]: T[K] extends DimensionValue | undefined
    ? string | DimensionValue | undefined
    : T[K];
};

export type Props<P extends ViewProps | AnimatedProps<ViewProps>> = P &
  OverrideStyle<P['style']> & {
    disabled?: boolean;
    disabledStyle?: OverrideStyle<ViewStyle>;
    hoverStyle?: OverrideStyle<ViewStyle>;
    pressStyle?: OverrideStyle<ViewStyle>;
  };

export function useComponentProps<P extends ViewProps>({
  style,
  disabled,
  disabledStyle,
  hoverStyle,
  pressStyle,
  ...otherProps
}: Partial<Props<P>>): ViewProps {
  const { colors, dimensions } = useTheme();

  const [state, setState] = useState({
    hovered: false,
    pressed: false,
  });

  const props: ViewProps = useMemo(() => {
    const filteredProps = Object.keys(otherProps)
      .filter((key) => !allStyleProps[key])
      .reduce(
        (obj, key) => ({
          ...obj,
          [key]: otherProps[key as 'id'],
        }),
        {},
      );

    return {
      ...filteredProps,
      ...(hoverStyle && {
        onPointerEnter: (e) => {
          setState((prev) => ({ ...prev, hovered: true }));

          otherProps.onPointerEnter?.(e);
        },
        onPointerLeave: (e) => {
          setState((prev) => ({ ...prev, hovered: false }));

          otherProps.onPointerLeave?.(e);
        },
      }),
      ...(pressStyle && {
        onPointerDown: (e) => {
          setState((prev) => ({ ...prev, pressed: true }));

          otherProps.onPointerDown?.(e);
        },
        onPointerUp: (e) => {
          setState((prev) => ({ ...prev, pressed: false }));

          otherProps.onPointerUp?.(e);
        },
        onTouchStart: (e) => {
          setState((prev) => ({ ...prev, pressed: true }));

          otherProps.onTouchStart?.(e);
        },
        onTouchEnd: (e) => {
          setState((prev) => ({ ...prev, pressed: false }));

          otherProps.onTouchEnd?.(e);
        },
      }),
    };
  }, [otherProps, hoverStyle, pressStyle]);

  const _style = useMemo(
    () =>
      [
        otherProps,
        ...(Array.isArray(style)
          ? style
          : style !== null && typeof style === 'object'
            ? [style]
            : []),
        {
          ...(state.hovered && hoverStyle),
          ...(state.pressed && {
            opacity: 0.8,
            ...pressStyle,
          }),
          ...(disabled && {
            opacity: 0.5,
            ...disabledStyle,
          }),
        },
      ].map((obj) =>
        Object.keys(obj)
          .filter((key) => allStyleProps[key])
          .reduce((newObj, key) => {
            const value = obj[key];

            if (colorStyleProps[key]) {
              return {
                ...newObj,
                [key]: colors[value] || value,
              };
            } else if (dimensionStyleProps[key]) {
              return {
                ...newObj,
                [key]: dimensions[value] || value,
              };
            } else {
              return {
                ...newObj,
                [key]: value,
              };
            }
          }, {}),
      ),
    [
      colors,
      dimensions,
      state.hovered,
      state.pressed,
      style,
      disabled,
      otherProps,
      hoverStyle,
      pressStyle,
      disabledStyle,
    ],
  );

  return {
    ...props,
    style: _style,
  };
}
