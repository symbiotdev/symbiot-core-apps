import { forwardRef, Ref, useCallback, useMemo, useState } from 'react';
import { Input, InputProps } from 'tamagui';
import { FormField } from './form-field';
import {
  NativeSyntheticEvent,
  Platform,
  TextInputKeyPressEventData,
  TextInputProps,
} from 'react-native';
import { useScheme } from '@symbiot-core-apps/state';
import { useDebounceCallback } from '@symbiot-core-apps/shared';
import { MediumText } from '../text/text';
import { InputCursorPosition, useInputSelection } from './input';

export const Textarea = forwardRef(
  (
    {
      value,
      label,
      placeholder,
      error,
      required,
      disabled,
      autoFocus,
      ignoreTab,
      countCharacters,
      debounce,
      maxLength,
      maxHeight = 220,
      height = Platform.OS === 'web' ? 46 * 2 : undefined,
      cursorAlwaysOn,
      enterKeyHint,
      autoCapitalize,
      onBlur,
      onFocus,
      onPress,
      onChange,
      onPressEnter,
      ...inputProps
    }: InputProps & {
      value?: string;
      label?: string;
      placeholder?: string;
      error?: string;
      disabled?: boolean;
      required?: boolean;
      autoFocus?: boolean;
      ignoreTab?: boolean;
      countCharacters?: boolean;
      debounce?: number; // only native devices
      maxLength?: number;
      cursorAlwaysOn?: InputCursorPosition;
      enterKeyHint?: TextInputProps['enterKeyHint'];
      autoCapitalize?: TextInputProps['autoCapitalize'];
      onBlur?: () => void;
      onFocus?: () => void;
      onPress?: () => void;
      onPressEnter?: () => void;
      onChange?: (value: string) => void;
    },
    ref: Ref<Input>,
  ) => {
    const { scheme } = useScheme();

    const selection = useInputSelection(cursorAlwaysOn, value);
    const onDebounceChange = useDebounceCallback(
      (value: string) => onChange?.(value),
      debounce || 0,
    );

    const [focused, setFocused] = useState(false);
    const [isScrolling, setIsScrolling] = useState(false);

    const id = useMemo(() => `textarea_${Math.random().toString(36)}`, []);
    const adjustedMaxLength = useMemo(() => maxLength || 512, [maxLength]); // 512 symbols enough for the regular fields

    const onKeyPress = useCallback(
      (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
        if (e.nativeEvent.key === 'Enter') {
          onPressEnter?.();
        }
      },
      [onPressEnter],
    );

    const onChangeText = useCallback(
      (text: string) => {
        if (text && maxLength && text.length > maxLength) {
          return;
        }

        if (ignoreTab) {
          text = text.replace(/\n|\s\s+/g, '');
        }

        Platform.OS === 'web' ? onChange?.(text) : onDebounceChange(text);
      },
      [ignoreTab, maxLength, onChange, onDebounceChange],
    );

    const onInputFocus = useCallback(() => {
      setFocused(true);

      onFocus?.();
    }, [onFocus]);

    const onInputBlur = useCallback(() => {
      setFocused(false);

      onBlur?.();
    }, [onBlur]);

    const onScroll = useCallback(() => {
      if (focused) {
        return;
      }

      if (Platform.OS === 'ios') {
        setIsScrolling(true);
      }
    }, [focused]);

    const onTouchEnd = useCallback(() => setIsScrolling(false), []);

    return (
      <FormField label={label} error={error} required={required}>
        <Input
          multiline
          ref={ref}
          id={id}
          value={value}
          autoFocus={autoFocus}
          backgroundColor="$inputBackgroundColor"
          borderWidth={0}
          borderRadius="$10"
          verticalAlign="top"
          paddingHorizontal="$4"
          placeholder={placeholder}
          placeholderTextColor="$placeholderColor"
          editable={!disabled && !isScrolling}
          // minHeight={46}
          minHeight={maxHeight} // temp to prevent jumps
          maxHeight={maxHeight}
          height={height}
          opacity={disabled ? 0.8 : 1}
          enterKeyHint={enterKeyHint}
          color={disabled ? '$disabled' : '$color'}
          maxLength={adjustedMaxLength}
          textContentType="oneTimeCode" // https://github.com/facebook/react-native/issues/39411
          keyboardAppearance={scheme}
          autoCapitalize={autoCapitalize || 'sentences'}
          outlineColor="transparent"
          scrollbarWidth="none"
          selection={selection}
          onFocus={onInputFocus}
          onBlur={onInputBlur}
          onChangeText={onChangeText}
          onKeyPress={onKeyPress}
          onScroll={onScroll}
          onTouchEnd={onTouchEnd}
          onPress={onPress}
          {...inputProps}
        />

        {!!countCharacters && (
          <MediumText
            color="$placeholderColor"
            fontSize={12}
            textAlign="right"
            paddingHorizontal="$4"
          >
            {value?.length || 0}/{adjustedMaxLength}
          </MediumText>
        )}
      </FormField>
    );
  },
);
