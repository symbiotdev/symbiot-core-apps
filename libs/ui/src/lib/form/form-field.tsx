import { LabelProps, TextProps, View, ViewProps } from 'tamagui';
import { Error, Label } from '../text/custom';
import { Platform } from 'react-native';

export const FormField = ({
  label,
  required,
  htmlFor,
  labelProps,
  error,
  errorProps,
  children,
  ...viewProps
}: ViewProps & {
  label?: string;
  required?: boolean;
  htmlFor?: string;
  labelProps?: LabelProps;
  error?: string;
  errorProps?: TextProps;
}) => {
  return (
    <View gap="$1" {...viewProps}>
      {!!label && (
        <Label
          paddingHorizontal="$3"
          htmlFor={htmlFor}
          {...labelProps}
          pointerEvents={Platform.OS === 'web' ? 'auto' : 'none'}
        >
          {label}
          {required ? '*' : ''}
        </Label>
      )}

      {children}

      {!!error && (
        <Error paddingHorizontal="$4" {...errorProps}>
          {error}
        </Error>
      )}
    </View>
  );
};
