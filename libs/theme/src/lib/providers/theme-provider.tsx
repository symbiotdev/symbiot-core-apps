import { createContext, PropsWithChildren, useMemo } from 'react';
import { TamaguiProvider } from 'tamagui';
import { tamaguiConfig, themes } from '../utils/tamagui-config';
import { useSystemScheme } from '@symbiot-core-apps/shared';
import {
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from '@react-navigation/native';
import { StatusBar } from 'react-native';

const Context = createContext({});

export const ThemeProvider = (props: PropsWithChildren) => {
  const scheme = useSystemScheme();
  const barStyle = useMemo(
    () => (scheme === 'dark' ? 'light-content' : 'dark-content'),
    [scheme]
  );

  return (
    <Context.Provider value={{}}>
      <StatusBar barStyle={barStyle} />
      <TamaguiProvider config={tamaguiConfig} defaultTheme={scheme}>
        <ThemeProviderChildren {...props} />
      </TamaguiProvider>
    </Context.Provider>
  );
};

const ThemeProviderChildren = ({ children }: PropsWithChildren) => {
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
  }, [scheme]);
  return (
    <NavigationThemeProvider value={themeProviderValue}>
      {children}
    </NavigationThemeProvider>
  );
};
