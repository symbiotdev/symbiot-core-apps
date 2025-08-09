import { Input, InputValue } from './input';
import * as yup from 'yup';
import { useCallback, useMemo } from 'react';
import { isValidURL } from '@symbiot-core-apps/shared';
import { TextInputProps } from 'react-native';

export type LinkItem = {
  title: string;
  url: string;
  iconName: string;
  iconType: string;
};

export const APP_LINK = {
  instagram: {
    domain: 'https://www.instagram.com/',
    getNicknameFromUrl: (input: string) => {
      try {
        if (!input.startsWith('http')) {
          input = 'https://' + input;
        }

        const url = new URL(input);

        if (!url.hostname.includes('instagram.com')) return null;

        const parts = url.pathname.split('/').filter(Boolean);

        return parts.length > 0 ? parts.pop() || '' : '';
      } catch {
        return '';
      }
    },
  },
  website: {
    getDomain: (input: string) => {
      try {
        if (!input.startsWith('http')) {
          input = 'https://' + input;
        }

        const url = new URL(input);

        return url.hostname;
      } catch {
        return '';
      }
    },
  },
};

export type AppLinkType = keyof typeof APP_LINK;

export const getAppLinkSchema = (error: string, optional = false) =>
  yup
    .object()
    .shape({
      title: optional ? yup.string().ensure() : yup.string().required(),
      url: optional ? yup.string().ensure() : yup.string().required(),
      iconName: optional ? yup.string().ensure() : yup.string().required(),
      iconType: optional ? yup.string().ensure() : yup.string().required(),
    })
    .test('link-validation', error, function (link) {
      return (
        optional ||
        (link &&
          !!link.title &&
          !!link.url &&
          !!link.iconName &&
          !!link.iconType &&
          isValidURL(link.url))
      );
    });

export const AppLinkInput = ({
  type,
  label,
  placeholder,
  error,
  value,
  enterKeyHint,
  autoCapitalize,
  onChange,
  onBlur,
}: {
  type: AppLinkType;
  value?: LinkItem | null;
  label?: string;
  placeholder?: string;
  error?: string;
  enterKeyHint?: TextInputProps['enterKeyHint'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
  onChange: (link: LinkItem | null) => void;
  onBlur?: () => void;
}) => {
  const inputValue = useMemo(() => {
    if (value && type === 'instagram') {
      return APP_LINK.instagram.getNicknameFromUrl(value.url);
    } else if (value && type === 'website') {
      return APP_LINK.website.getDomain(value.url);
    } else {
      return value?.url || '';
    }
  }, [type, value]);

  const onInputChange = useCallback(
    (value: InputValue) => {
      if (!value) {
        onChange(null);
      } else if (type === 'instagram') {
        const srtValue = String(value);
        const nickname = isValidURL(srtValue)
          ? APP_LINK.instagram.getNicknameFromUrl(srtValue)
          : value;

        onChange({
          title: 'Instagram',
          url: `${APP_LINK.instagram.domain}${nickname}`,
          iconType: 'SocialIcon',
          iconName: 'Instagram',
        });
      } else if (type === 'website') {
        const srtValue = String(value);

        onChange({
          title: 'Website',
          url: `https://${APP_LINK.website.getDomain(srtValue)}`,
          iconType: 'Icon',
          iconName: 'PaperclipRounded',
        });
      } else {
        onChange(null);
      }
    },
    [onChange, type],
  );

  return (
    <Input
      value={inputValue}
      label={label}
      placeholder={placeholder}
      error={error}
      enterKeyHint={enterKeyHint}
      autoCapitalize={autoCapitalize}
      onChange={onInputChange}
      onBlur={onBlur}
    />
  );
};
