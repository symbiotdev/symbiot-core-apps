import { InputFieldView, InputHeight } from '../view/input-field-view';
import { TextInputProps } from 'react-native';
import { Input as InputUi, InputProps, XStackProps } from 'tamagui';
import { Icon } from '../icons';
import { InputCursorPosition, useInputSelection } from './input';
import { useScheme } from '@symbiot-core-apps/state';
import { useDebounceCallback } from '@symbiot-core-apps/shared';
import { forwardRef, Ref, useCallback, useMemo, useState } from 'react';
import { FormField } from './form-field';

export const Search = forwardRef(
  (
    {
      value,
      label,
      placeholder,
      error,
      disabled,
      required,
      autoFocus,
      debounce,
      maxLength,
      cursorAlwaysOn,
      inputFieldProps,
      inputProps,
      enterKeyHint,
      autoCapitalize,
      onBlur,
      onFocus,
      onPress,
      onChange,
    }: {
      value: string;
      label?: string;
      placeholder?: string;
      error?: string;
      disabled?: boolean;
      required?: boolean;
      autoFocus?: boolean;
      debounce?: number;
      maxLength?: number;
      inputFieldProps?: XStackProps;
      inputProps?: InputProps;
      cursorAlwaysOn?: InputCursorPosition;
      enterKeyHint?: TextInputProps['enterKeyHint'];
      autoCapitalize?: TextInputProps['autoCapitalize'];
      onBlur?: () => void;
      onFocus?: () => void;
      onPress?: () => void;
      onChange: (text: string) => void;
    },
    ref: Ref<InputUi>,
  ) => {
    const { scheme } = useScheme();

    const [adjustedValue, setAdjustedValue] = useState(String(value || ''));

    const selection = useInputSelection(cursorAlwaysOn, adjustedValue);

    const id = useMemo(() => `search_${Math.random().toString(36)}`, []);

    const onDebounceChange = useDebounceCallback(onChange, debounce || 0);

    const onChangeText = useCallback(
      (text: string) => {
        setAdjustedValue(text);
        onDebounceChange(text);
      },
      [onDebounceChange],
    );

    return (
      <FormField label={label} error={error} required={required}>
        <InputFieldView {...inputFieldProps} gap="$1">
          <Icon name="Magnifer" color="$placeholderColor" size={18} />
          <InputUi
            ref={ref}
            id={id}
            value={adjustedValue}
            autoFocus={autoFocus}
            flex={1}
            borderWidth={0}
            height={InputHeight}
            placeholder={placeholder}
            placeholderTextColor="$placeholderColor"
            inputMode="search"
            editable={!disabled}
            opacity={disabled ? 0.8 : 1}
            enterKeyHint={enterKeyHint}
            color={disabled ? '$disabled' : '$color'}
            clearTextOnFocus={false}
            maxLength={maxLength || 250} // 250 symbols enough for the regular fields
            textContentType="oneTimeCode" // https://github.com/facebook/react-native/issues/39411
            keyboardAppearance={scheme}
            autoCapitalize={autoCapitalize || 'sentences'}
            outlineColor="transparent"
            selection={selection}
            onFocus={onFocus}
            onBlur={onBlur}
            onChangeText={onChangeText}
            onPress={onPress}
            {...inputProps}
          />
        </InputFieldView>
      </FormField>
    );
  },
);
