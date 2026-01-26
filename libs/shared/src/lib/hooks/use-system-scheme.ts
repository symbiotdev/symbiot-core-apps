import { useEffect, useState } from 'react';
import { Appearance } from 'react-native';

export type SystemScheme = 'light' | 'dark';

export const systemSchemes: SystemScheme[] = ['light', 'dark'] as const;

export const defaultSystemScheme = () =>
  Appearance.getColorScheme() || systemSchemes[0];

export const useSystemScheme = () => {
  const [scheme, setScheme] = useState<SystemScheme>(defaultSystemScheme());

  useEffect(() => {
    const listener = Appearance.addChangeListener(({ colorScheme }) =>
      setScheme(colorScheme || defaultSystemScheme()),
    );

    return () => listener.remove();
  }, []);

  return scheme;
};
