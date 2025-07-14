import { LabelProps, TextProps, View } from 'tamagui';
import { PropsWithChildren } from 'react';
import { Error, Label } from '../text/custom';

export const FormField = ({
  label,
  required,
  htmlFor,
  labelProps,
  error,
  errorProps,
  children,
}: PropsWithChildren<{
  label?: string;
  required?: boolean;
  htmlFor?: string;
  labelProps?: LabelProps;
  error?: string;
  errorProps?: TextProps;
}>) => {
  return (
    <View width="100%" gap="$2">
      {!!label && (
        <Label paddingHorizontal="$3" htmlFor={htmlFor} {...labelProps}>
          {label}
          {required ? '*' : ''}
        </Label>
      )}

      {children}

      {!!error && (
        <Error paddingHorizontal="$3" {...errorProps}>
          {error}
        </Error>
      )}
    </View>
  );
};
