import { useEffect, useState } from 'react';
import { Appearance } from 'react-native';

type Scheme = 'light' | 'dark';

const defaultScheme = 'light';

export const useSystemScheme = () => {
  const [systemScheme, setSystemScheme] = useState<Scheme>(
    Appearance.getColorScheme() || defaultScheme,
  );

  useEffect(() => {
    const listener = Appearance.addChangeListener(({ colorScheme }) =>
      setSystemScheme(colorScheme || defaultScheme),
    );

    return () => listener.remove();
  }, []);

  return systemScheme;
};
