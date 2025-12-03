import { DimensionValue, ViewProps, ViewStyle } from 'react-native';
import { useMemo } from 'react';
import {
  allStyleProps,
  colorStyleProps,
  dimensionStyleProps,
} from '../utils/style-props';
import { AnimatedProps } from 'react-native-reanimated';

type OverrideStyle<T> = {
  [K in keyof T]: T[K] extends DimensionValue | undefined
    ? string | DimensionValue | undefined
    : T[K];
};

export type Props<P extends ViewProps | AnimatedProps<ViewProps>> = P &
  OverrideStyle<P['style']> & {
    disabled?: boolean;
    disabledStyle?: OverrideStyle<ViewStyle>;
  };

const colors: Record<string, string> = {
  $primary: '#FFFFFF',
  $secondary: 'red',
};

const dimensions: Record<string, number> = {
  $1: 5,
  $2: 10,
};

export function useComponentProps<P extends ViewProps>({
  style,
  disabled,
  disabledStyle,
  ...otherProps
}: Partial<Props<P>>): ViewProps {
  const props = useMemo(
    () =>
      Object.keys(otherProps)
        .filter((key) => !allStyleProps[key])
        .reduce(
          (obj, key) => ({
            ...obj,
            [key]: otherProps[key as 'id'],
          }),
          {},
        ),
    [otherProps],
  );

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
    [disabled, disabledStyle, style, otherProps],
  );

  return {
    ...props,
    style: _style,
  };
}
