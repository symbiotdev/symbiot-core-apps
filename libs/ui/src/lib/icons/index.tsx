import { useTheme } from 'tamagui';
import { memo } from 'react';
import { Map as SolarBold } from './solar/bold/_index';
import { Map as SolarBoldDuotone } from './solar/bold-duotone/_index';
import { Map as SolarBroken } from './solar/broken/_index';
import { Map as SolarLinear } from './solar/linear/_index';
import { Map as SolarLinearDuotone } from './solar/linear-duotone/_index';
import { Map as Social } from './social/_index';
import { IconName } from './config';
import { ViewStyle } from 'react-native';

const Map = {
  SolarBold,
  SolarBoldDuotone,
  SolarBroken,
  SolarLinear,
  SolarLinearDuotone,
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
    const IconComponent = Map[type][name];

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

export const SocialIcon = memo(
  ({
    name,
    scalable,
    color,
    size = 24,
    style,
  }: {
    name: keyof typeof Social;
    scalable?: boolean;
    color?: string;
    size?: number;
    style?: ViewStyle;
  }) => {
    const theme = useTheme();
    const IconComponent = Social[name];

    if (!IconComponent) {
      return null;
    }

    return (
      <IconComponent
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
