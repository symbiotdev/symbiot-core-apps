import { useTheme } from 'tamagui';
import { memo } from 'react';
import { Map as SolarBold } from './solar/bold/_index';
import { Map as SolarLinear } from './solar/linear/_index';
import { Map as Social, SocialIconName } from './social/_index';
import { SolarIconName } from './config';
import { ViewStyle } from 'react-native';

export type IconName = SolarIconName | SocialIconName;

const Map = {
  SolarBold,
  SolarLinear,
} as const;

export const defaultIconSize = 24;

export const Icon = memo(
  ({
    name,
    scalable,
    color,
    size = defaultIconSize,
    type = 'SolarLinear',
    style,
  }: {
    name: IconName;
    scalable?: boolean;
    color?: string;
    size?: number;
    type?: keyof typeof Map;
    style?: ViewStyle;
  }) => {
    const theme = useTheme();
    const IconComponent =
      Social[name as SocialIconName] || Map[type][name as SolarIconName];

    if (!IconComponent) {
      return null;
    }

    return (
      <IconComponent
        key={name}
        color={color ? theme[color]?.val || color : theme.color?.val}
        width={size}
        height={size}
        style={{
          ...style,
          pointerEvents: 'none',
          ...(!scalable && {
            minWidth: size,
            minHeight: size,
          }),
        }}
      />
    );
  },
);
