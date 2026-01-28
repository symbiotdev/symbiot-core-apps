import { LabelProps, TextProps, View, ViewProps } from 'tamagui';
import { Platform } from 'react-native';
import { Error, Label, RegularText } from '@symbiot-core-apps/ui';

export const FormField = ({
  label,
  required,
  htmlFor,
  labelProps,
  description,
  error,
  errorProps,
  children,
  ...viewProps
}: ViewProps & {
  label?: string;
  description?: string;
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

      {!!description && !error && (
        <RegularText paddingHorizontal="$4" color="$placeholderColor">{description}</RegularText>
      )}

      {!!error && (
        <Error paddingHorizontal="$4" {...errorProps}>
          {error}
        </Error>
      )}
    </View>
  );
};
