import { createContext, PropsWithChildren, useMemo } from 'react';
import { createTamagui, TamaguiProvider } from 'tamagui';
import {
  animations,
  fonts,
  radius,
  size,
  space,
  ThemeConfig,
  zIndex,
} from '../utils/tamagui-config';
import { Scheme, useSystemScheme } from '@symbiot-core-apps/shared';
import {
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from '@react-navigation/native';
import { StatusBar } from 'react-native';

const Context = createContext({});

export const ThemeProvider = ({
  children,
  lightTheme,
  darkTheme,
}: PropsWithChildren<{ lightTheme: ThemeConfig; darkTheme: ThemeConfig }>) => {
  const scheme = useSystemScheme();
  const barStyle = useMemo(
    () => (scheme === 'dark' ? 'light-content' : 'dark-content'),
    [scheme]
  );

  const themes = useMemo(
    () => ({
      light: {
        ...lightTheme,
        ...Object.keys(darkTheme).reduce(
          (obj, key) => ({
            ...obj,
            [`o_${key}`]: darkTheme[key as keyof ThemeConfig],
          }),
          {}
        ),
      },
      dark: {
        ...darkTheme,
        ...Object.keys(lightTheme).reduce(
          (obj, key) => ({
            ...obj,
            [`o_${key}`]: lightTheme[key as keyof ThemeConfig],
          }),
          {}
        ),
      },
    }),
    [darkTheme, lightTheme]
  );

  const config = useMemo(
    () =>
      createTamagui({
        animations,
        fonts,
        themes,
        tokens: {
          size,
          space,
          zIndex,
          radius,
        },
        settings: {
          defaultFont: 'body',
          fastSchemeChange: true,
          shouldAddPrefersColorThemes: true,
          allowedStyleValues: 'somewhat-strict-web',
          themeClassNameOnRoot: true,
          onlyAllowShorthands: true,
        },
      }),
    [themes]
  );

  return (
    <Context.Provider value={{}}>
      <StatusBar barStyle={barStyle} />
      <TamaguiProvider config={config} defaultTheme={scheme}>
        <ThemeProviderChildren children={children} themes={themes} />
      </TamaguiProvider>
    </Context.Provider>
  );
};

const ThemeProviderChildren = ({
  children,
  themes,
}: PropsWithChildren<{ themes: Record<Scheme, ThemeConfig> }>) => {
  const scheme = useSystemScheme();

  const themeProviderValue = useMemo(() => {
    const dark = scheme === 'dark';
    const background = themes[scheme].background;
    const color = themes[scheme].color;

    return {
      ...DefaultTheme,
      dark,
      colors: {
        ...DefaultTheme.colors,
        background,
        card: background,
        text: color,
        primary: color,
      },
    };
  }, [scheme, themes]);

  return (
    <NavigationThemeProvider value={themeProviderValue}>
      {children}
    </NavigationThemeProvider>
  );
};
