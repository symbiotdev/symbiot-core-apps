import { TextInput, TextInputProps } from 'react-native';
import { FormField } from './form-field';
import { PhoneNumber } from 'react-native-phone-input/dist';
import * as yup from 'yup';
import { useCallback, useEffect, useRef } from 'react';
import PhoneInputUI from 'react-native-phone-input';
import { useScheme } from '@symbiot-core-apps/store';
import { useTheme } from 'tamagui';
import { InputFieldView } from '../view/input-field-view';

type Phone = {
  formatted: string;
  tel: string;
  country: string;
};

export const phoneDefaultValue = {
  country: '',
  formatted: '',
  tel: '',
};

export const getPhoneInputSchema = (error: string, optional?: boolean) => {
  return yup
    .object()
    .shape({
      country: optional ? yup.string().ensure() : yup.string().required(),
      formatted: optional ? yup.string().ensure() : yup.string().required(),
      tel: optional ? yup.string().ensure() : yup.string().required(),
    })
    .test('phone-validation', error, function (phone) {
      if (!phone || !phone.country || !phone.tel || !phone.formatted) {
        return optional;
      }

      return PhoneNumber.isValidNumber(phone.tel, phone.country);
    });
};

export const PhoneInput = ({
  value,
  label,
  placeholder,
  error,
  disabled,
  autoFocus,
  autoFocusDelay,
  enterKeyHint,
  onBlur,
  onChange,
}: {
  value: Phone;
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  autoFocusDelay?: number;
  enterKeyHint?: TextInputProps['enterKeyHint'];
  onBlur?: () => void;
  onChange?: (phone: Phone) => void;
}) => {
  const { scheme } = useScheme();
  const theme = useTheme();

  const phoneRef = useRef<PhoneInputUI<typeof TextInput>>(null);

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

        onChange?.(phoneDefaultValue);
      }
    }

    onBlur?.();
  }, [onBlur, onChange]);

  const onChangePhoneNumber = useCallback(
    (formatted: string, iso: string) => {
      onChange?.({
        tel: (phoneRef.current?.getValue() || '').replace(/\D/g, ''),
        country: iso,
        formatted,
      });
    },
    [onChange],
  );

  useEffect(() => {
    if (autoFocus) {
      // fix issue with android behavior
      setTimeout(() => phoneRef.current?.focus(), autoFocusDelay || 0);
    }
  }, []);

  return (
    <FormField label={label} error={error}>
      <InputFieldView>
        <PhoneInputUI
          autoFormat
          ref={phoneRef}
          disabled={disabled}
          initialCountry={value?.country}
          initialValue={value?.tel}
          flagStyle={{ display: 'none' }}
          textStyle={{
            fontFamily: 'BodyRegular',
            outlineWidth: 0,
            fontSize: 14,
            marginLeft: -10,
            color: disabled ? theme.disabled?.val : theme.color?.val,
          }}
          style={{
            backgroundColor: 'transparent',
            width: '100%',
            height: '100%',
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
          onChangePhoneNumber={onChangePhoneNumber}
        />
      </InputFieldView>
    </FormField>
  );
};
