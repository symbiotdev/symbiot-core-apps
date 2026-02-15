import { useCallback, useEffect, useState } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';

export type SystemScheme = 'light' | 'dark';

const schemeByName: Record<ColorSchemeName, SystemScheme> = {
  light: 'light',
  dark: 'dark',
  unspecified: 'dark',
};

export const activeSystemScheme = () => {
  const colorScheme = Appearance.getColorScheme();

  return colorScheme
    ? schemeByName[colorScheme] || schemeByName.unspecified
    : schemeByName.unspecified;
};

export const useSystemScheme = () => {
  // useColorScheme from RN is not working as expected
  const [scheme, setSystemScheme] =
    useState<SystemScheme>(activeSystemScheme());

  useEffect(() => {
    const listener = Appearance.addChangeListener(({ colorScheme }) =>
      setSystemScheme(schemeByName[colorScheme] || schemeByName.unspecified),
    );

    return () => listener.remove();
  }, []);

  return {
    scheme,
    setScheme: useCallback((scheme: ColorSchemeName | null) => {
      const adjustedScheme = scheme
        ? schemeByName[scheme] || schemeByName.unspecified
        : schemeByName.unspecified;

      setSystemScheme(adjustedScheme);

      if (Appearance.getColorScheme() !== adjustedScheme) {
        Appearance.setColorScheme(adjustedScheme);
      }
    }, []),
  };
};
