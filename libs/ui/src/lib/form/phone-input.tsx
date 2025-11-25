import { TextInput, TextInputProps } from 'react-native';
import { FormField } from './form-field';
import { useCallback, useEffect, useRef } from 'react';
import PhoneInputUI from 'react-native-phone-input';
import { useScheme } from '@symbiot-core-apps/state';
import { useTheme } from 'tamagui';
import { InputFieldView, InputHeight } from '../view/input-field-view';

export const PhoneInput = ({
  value,
  label,
  placeholder,
  error,
  disabled,
  required,
  autoFocus,
  autoFocusDelay,
  enterKeyHint,
  onBlur,
  onChange,
}: {
  value: string;
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  autoFocus?: boolean;
  autoFocusDelay?: number;
  enterKeyHint?: TextInputProps['enterKeyHint'];
  onBlur?: () => void;
  onChange?: (phone: string) => void;
}) => {
  const { scheme } = useScheme();
  const theme = useTheme();

  const phoneRef = useRef<PhoneInputUI<typeof TextInput>>(null);

  const change = useCallback(() => {
    onChange?.(phoneRef.current?.getValue() || '');
  }, [onChange]);

  const blur = useCallback(() => {
    if (!phoneRef.current?.isValidNumber()) {
      const state = phoneRef.current?.state as {
        displayValue: string;
        value: string;
        iso2: string;
      };

      if (!state['displayValue'] || !state['value'] || !state['iso2']) {
        phoneRef.current?.setState((prev) => ({
          ...prev,
          displayValue: '',
          value: '',
        }));

        onChange?.('');
      }
    }

    onBlur?.();
  }, [onBlur, onChange]);

  useEffect(() => {
    if (autoFocus) {
      // fix issue with android behavior
      setTimeout(() => phoneRef.current?.focus(), autoFocusDelay || 0);
    }
  }, []);

  return (
    <FormField label={label} error={error} required={required}>
      <InputFieldView>
        <PhoneInputUI
          autoFormat
          ref={phoneRef}
          disabled={disabled}
          initialValue={value}
          flagStyle={{ display: 'none' }}
          textStyle={{
            fontFamily: 'BodyLight',
            outlineWidth: 0,
            fontSize: 14,
            marginLeft: -10,
            color: disabled ? theme.$placeholderColor?.val : theme.$color?.val,
          }}
          style={{
            backgroundColor: 'transparent',
            width: '100%',
            height: InputHeight,
          }}
          textProps={{
            keyboardAppearance: scheme,
            maxLength: 30,
            placeholder,
            placeholderTextColor: theme.placeholderColor?.val,
            enterKeyHint,
            textContentType: 'oneTimeCode', // https://github.com/facebook/react-native/issues/39411
            onBlur: blur,
          }}
          onChangePhoneNumber={change}
        />
      </InputFieldView>
    </FormField>
  );
};
