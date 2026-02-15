import { DimensionValue, StyleProp, ViewProps, ViewStyle } from 'react-native';
import { useMemo, useState } from 'react';
import {
  allStyleProps,
  colorStyleProps,
  dimensionStyleProps,
} from '../utils/style-props';
import { useTheme } from './use-theme';

type OverrideStyle<T> = {
  [K in keyof T]: T[K] extends DimensionValue | undefined
    ? string | DimensionValue | undefined
    : T[K];
};

export type ComponentProps<C> = {
  key?: string;
  style?: StyleProp<C>;
};

export type Props<C extends ComponentProps<C>> = C &
  OverrideStyle<C['style']> & {
    disabled?: boolean;
    disabledStyle?: OverrideStyle<ViewStyle>;
    hoverStyle?: OverrideStyle<ViewStyle>;
    pressStyle?: OverrideStyle<ViewStyle>;
  };

export function useComponentProps<C extends ComponentProps<C>>({
  style,
  disabled,
  disabledStyle,
  hoverStyle,
  pressStyle,
  ...otherProps
}: Partial<Props<C>>) {
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
          [key]: otherProps[key as 'key'],
        }),
        {},
      );

    return {
      ...filteredProps,
      ...(hoverStyle && {
        onPointerEnter: (e) => {
          setState((prev) => ({ ...prev, hovered: true }));

          (otherProps as ViewProps).onPointerEnter?.(e);
        },
        onPointerLeave: (e) => {
          setState((prev) => ({ ...prev, hovered: false }));

          (otherProps as ViewProps).onPointerLeave?.(e);
        },
      }),
      ...(pressStyle && {
        onPointerDown: (e) => {
          setState((prev) => ({ ...prev, pressed: true }));

          (otherProps as ViewProps).onPointerDown?.(e);
        },
        onPointerUp: (e) => {
          setState((prev) => ({ ...prev, pressed: false }));

          (otherProps as ViewProps).onPointerUp?.(e);
        },
        onTouchStart: (e) => {
          setState((prev) => ({ ...prev, pressed: true }));

          (otherProps as ViewProps).onTouchStart?.(e);
        },
        onTouchEnd: (e) => {
          setState((prev) => ({ ...prev, pressed: false }));

          (otherProps as ViewProps).onTouchEnd?.(e);
        },
      }),
    };
  }, [otherProps, hoverStyle, pressStyle]);

  return {
    ...props,
    style: useMemo(
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
    ),
  };
}
