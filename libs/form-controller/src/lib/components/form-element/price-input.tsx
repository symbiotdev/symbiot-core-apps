import { useTheme } from 'tamagui';
import { useScheme } from '@symbiot-core-apps/state';
import { useCallback } from 'react';
import { MaskedTextInput } from 'react-native-mask-text';
import { priceMaskOptions } from '@symbiot-core-apps/shared';
import { FormField } from '../wrapper/form-field';
import { InputFieldView } from '../wrapper/input-field-view';
import { MediumText } from '@symbiot-core-apps/ui';

export const PriceInput = ({
  value,
  max,
  label,
  symbol,
  placeholder,
  error,
  disabled,
  required,
  onFocus,
  onBlur,
  onChange,
}: {
  value?: number;
  max?: number;
  label?: string;
  symbol?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  onBlur?: () => void;
  onFocus?: () => void;
  onChange?: (value: number | null) => void;
}) => {
  const theme = useTheme();
  const { scheme } = useScheme();

  const onChangeText = useCallback(
    (formatted: string, extracted?: string) => {
      onChange?.(
        extracted
          ? max
            ? Math.min(Number(extracted), max)
            : Number(extracted)
          : null,
      );
    },
    [max, onChange],
  );

  return (
    <FormField label={label} error={error} required={required}>
      <InputFieldView gap="$3">
        {!!symbol && (
          <MediumText color="$placeholderColor">{symbol}</MediumText>
        )}

        <MaskedTextInput
          type="currency"
          options={priceMaskOptions}
          textContentType="oneTimeCode" // https://github.com/facebook/react-native/issues/39411
          value={String(value || '')}
          placeholder={placeholder || '0.00'}
          style={{
            flex: 1,
            color: theme?.color?.val,
            outline: 'none',
            fontFamily: 'BodyLight',
          }}
          readOnly={disabled}
          keyboardAppearance={scheme}
          keyboardType="numeric"
          onFocus={onFocus}
          onBlur={onBlur}
          onChangeText={onChangeText}
        />
      </InputFieldView>
    </FormField>
  );
};
