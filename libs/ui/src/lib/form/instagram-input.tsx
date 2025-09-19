import { Input, InputValue, onChangeInput } from './input';
import { useCallback } from 'react';
import { TextInputProps } from 'react-native';
import { APP_LINK } from './app-link-input';

const getNicknameFromUrl = (input?: InputValue) => {
  if (!input) return '';

  input = String(input);

  try {
    if (!input.startsWith('http')) {
      input = 'https://' + input;
    }

    const url = new URL(input);

    if (!url.hostname.includes('instagram.com')) return '';

    const parts = url.pathname.split('/').filter(Boolean);

    return parts.length > 0 ? parts.pop() || '' : '';
  } catch {
    return '';
  }
};

export const InstagramInput = ({
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
    (value: string) => {
      onChange(!value ? null : `${APP_LINK.instagram.domain}${value}`);
    },
    [onChange],
  );

  return (
    <Input
      value={getNicknameFromUrl(value)}
      label={label}
      placeholder={placeholder}
      error={error}
      disabled={disabled}
      required={required}
      enterKeyHint={enterKeyHint}
      autoCapitalize={autoCapitalize}
      onChange={onInputChange as onChangeInput}
      onBlur={onBlur}
    />
  );
};
