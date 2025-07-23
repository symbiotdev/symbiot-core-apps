import { useEffect, useState } from 'react';
import { Appearance } from 'react-native';

export type Scheme = 'light' | 'dark';

export const schemes: Scheme[] = ['light', 'dark'] as const;

export const defaultSystemScheme = () =>
  Appearance.getColorScheme() || schemes[0];

export const useSystemScheme = () => {
  const [scheme, setScheme] = useState<Scheme>(defaultSystemScheme());

  useEffect(() => {
    const listener = Appearance.addChangeListener(({ colorScheme }) =>
      setScheme(colorScheme || defaultSystemScheme()),
    );

    return () => listener.remove();
  }, []);

  return scheme;
};
