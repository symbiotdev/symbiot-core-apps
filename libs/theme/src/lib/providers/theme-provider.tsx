import { PropsWithChildren, useMemo } from 'react';
import { createTamagui, TamaguiProvider, View } from 'tamagui';
import {
  animations,
  fonts,
  media,
  mediaQueryDefaultActive,
  radius,
  size,
  space,
  zIndex,
} from '../utils/tamagui-config';
import {
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { useScheme } from '@symbiot-core-apps/state';
import { AppConfigLegacy, ThemeConfigLegacy } from '@symbiot-core-apps/api';

export const ThemeProvider = ({
  children,
  theme,
}: PropsWithChildren<{ theme: AppConfigLegacy['theme'] }>) => {
  const { scheme } = useScheme();

  const barStyle = useMemo(
    () => (scheme === 'dark' ? 'light-content' : 'dark-content'),
    [scheme],
  );

  const navigationConfig = useMemo(() => {
    const dark = scheme === 'dark';
    const background = theme[scheme].background;
    const color = theme[scheme].color;

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
  }, [scheme, theme]);

  const tamaguiConfig = useMemo(
    () =>
      createTamagui({
        animations,
        fonts,
        media,
        tokens: {
          size,
          space,
          zIndex,
          radius,
        },
        settings: {
          mediaQueryDefaultActive,
          defaultFont: 'body',
          fastSchemeChange: true,
          shouldAddPrefersColorThemes: true,
          allowedStyleValues: 'somewhat-strict-web',
          themeClassNameOnRoot: true,
          onlyAllowShorthands: true,
        },
        themes: {
          light: {
            ...theme.light,
            ...Object.keys(theme.dark).reduce(
              (obj, key) => ({
                ...obj,
                [`o_${key}`]: theme.dark[key as keyof ThemeConfigLegacy],
              }),
              {},
            ),
          },
          dark: {
            ...theme.dark,
            ...Object.keys(theme.light).reduce(
              (obj, key) => ({
                ...obj,
                [`o_${key}`]: theme.light[key as keyof ThemeConfigLegacy],
              }),
              {},
            ),
          },
        },
      }),
    [theme],
  );

  return (
    <>
      <StatusBar barStyle={barStyle} />
      <TamaguiProvider config={tamaguiConfig} defaultTheme={scheme}>
        <View flex={1} backgroundColor="$background">
          <NavigationThemeProvider value={navigationConfig}>
            {children}
          </NavigationThemeProvider>
        </View>
      </TamaguiProvider>
    </>
  );
};
