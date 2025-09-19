import { Input, InputValue } from './input';
import { useCallback } from 'react';
import { TextInputProps } from 'react-native';

const getDomain = (input?: InputValue) => {
  if (!input) return '';

  input = String(input);

  try {
    const url = new URL(!input.startsWith('http') ? `https://${input}` : input);

    return url.hostname;
  } catch {
    return '';
  }
};

export const WebsiteInput = ({
  label,
  placeholder,
  error,
  value,
  disabled,
  required,
  enterKeyHint,
  autoCapitalize,
  onChange,
  onBlur,
}: {
  value?: string | null;
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  enterKeyHint?: TextInputProps['enterKeyHint'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
  onChange: (link: string | null) => void;
  onBlur?: () => void;
}) => {
  const onInputChange = useCallback(
    (value: InputValue) => {
      onChange(!value ? null : `https://${getDomain(value)}`);
    },
    [onChange],
  );

  return (
    <Input
      value={getDomain(value)}
      label={label}
      placeholder={placeholder}
      error={error}
      disabled={disabled}
      required={required}
      enterKeyHint={enterKeyHint}
      autoCapitalize={autoCapitalize}
      onChange={onInputChange}
      onBlur={onBlur}
    />
  );
};
