import { memo } from 'react';
import { Map as SolarBold } from './solar/bold/_index';
import { Map as SolarLinear } from './solar/linear/_index';
import { Map as Social, SocialIconName } from './social/_index';
import { ViewStyle } from 'react-native';
import { useAppScheme } from '@symbiot-core-apps/state';
import { SolarIconName } from './types/config';

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
    const { scheme } = useAppScheme();
    const IconComponent =
      Social[name as SocialIconName] || Map[type][name as SolarIconName];
    // fixme colorize
    const _color = color || (scheme === 'dark' ? '#FFFFFF' : '#000000');

    if (!IconComponent) {
      return null;
    }

    return (
      <IconComponent
        key={name}
        color={_color}
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
