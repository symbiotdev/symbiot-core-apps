import { InputModeOptions, KeyboardType, TextInputProps } from 'react-native';
import { forwardRef, Ref, useCallback, useMemo } from 'react';
import { Input as InputUi, InputProps } from 'tamagui';
import { FormField } from './form-field';
import { useDebounceCallback } from '@symbiot-core-apps/shared';
import { useScheme } from '@symbiot-core-apps/store';

export type InputValue = string | number | null;
export type onChangeInput = (value: InputValue) => void;

export const Input = forwardRef(
  (
    {
      value,
      label,
      placeholder,
      error,
      type,
      keyboardType,
      disabled,
      autoFocus,
      debounce,
      maxLength,
      cursorAlwaysOn,
      regex,
      inputProps,
      enterKeyHint,
      autoCapitalize,
      onBlur,
      onFocus,
      onPress,
      onChange,
    }: {
      value: InputValue;
      label?: string;
      placeholder?: string;
      error?: string;
      type?: 'email' | 'password' | 'text' | 'numeric';
      keyboardType?: KeyboardType;
      disabled?: boolean;
      autoFocus?: boolean;
      debounce?: number;
      maxLength?: number;
      cursorAlwaysOn?: 'start' | 'end' | number;
      regex?: RegExp;
      inputProps?: InputProps;
      enterKeyHint?: TextInputProps['enterKeyHint'];
      autoCapitalize?: TextInputProps['autoCapitalize'];
      onBlur?: () => void;
      onFocus?: () => void;
      onPress?: () => void;
      onChange?: onChangeInput;
    },
    ref: Ref<InputUi>,
  ) => {
    const { scheme } = useScheme();

    const onDebounceChange = useDebounceCallback(
      (value: InputValue) => onChange?.(value),
      debounce || 0,
    );

    const id = useMemo(() => `input_${Math.random().toString(36)}`, []);

    const secureTextEntry = useMemo(() => type === 'password', [type]);

    const selection = useMemo(() => {
      if (cursorAlwaysOn === undefined) {
        return undefined;
      }
      if (typeof cursorAlwaysOn === 'number') {
        return { start: cursorAlwaysOn, end: cursorAlwaysOn };
      } else if (cursorAlwaysOn === 'start') {
        return { start: 0, end: 0 };
      } else {
        const str = String(value);

        return { start: str.length, end: str.length };
      }
    }, [cursorAlwaysOn, value]);

    const onChangeText = useCallback(
      (text: string) => {
        let nextValue: string | number | null = text;

        if (text && maxLength && text.length > maxLength) {
          return;
        }

        if (regex) {
          nextValue = (text as string).match(regex)?.join('') || '';
        }

        if (type === 'numeric') {
          const numValue = Number(text);

          nextValue = isNaN(numValue) ? 0 : numValue;
        }

        onChange?.(nextValue);
        onDebounceChange(nextValue);
      },
      [maxLength, onChange, onDebounceChange, regex, type],
    );

    return (
      <FormField label={label} error={error}>
        <InputUi
          ref={ref}
          id={id}
          value={value as string}
          autoFocus={autoFocus}
          backgroundColor="$inputBackgroundColor"
          borderWidth={0}
          height={46}
          borderRadius="$10"
          paddingHorizontal="$6"
          placeholder={placeholder}
          placeholderTextColor="$placeholderColor"
          inputMode={type as InputModeOptions}
          secureTextEntry={secureTextEntry}
          editable={!disabled}
          opacity={disabled ? 0.8 : 1}
          enterKeyHint={enterKeyHint}
          color={disabled ? '$disabled' : '$color'}
          clearTextOnFocus={false}
          maxLength={maxLength || 200} // 200 symbols enough for the regular fields
          textContentType="oneTimeCode" // https://github.com/facebook/react-native/issues/39411
          keyboardAppearance={scheme}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize || 'none'}
          outlineColor="transparent"
          selection={selection}
          onFocus={onFocus}
          onBlur={onBlur}
          onChangeText={onChangeText}
          onPress={onPress}
          {...inputProps}
        />
      </FormField>
    );
  },
);
