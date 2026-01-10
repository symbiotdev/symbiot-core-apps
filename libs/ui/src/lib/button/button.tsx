import { cloneElement, ReactElement } from 'react';
import { MediumText } from '../text/text';
import {
  ColorTokens,
  useTheme,
  View,
  ViewProps,
  XStack,
  XStackProps,
} from 'tamagui';
import { Spinner } from '../loading/spinner';
import { emitHaptic } from '@symbiot-core-apps/shared';
import { Icon, IconName } from '../icons';
import { ViewStyle } from 'react-native';

export const ButtonTheme = {
  default: {
    color: '$buttonTextColor',
    backgroundColor: '$buttonBackground',
    borderColor: 'transparent',
  },
  clear: {
    color: '$buttonTextColor1',
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  outlined: {
    color: '$buttonTextColor1',
    backgroundColor: 'transparent',
    borderColor: '$buttonBackground',
  },
  danger: {
    color: '$buttonTextColor',
    backgroundColor: '$error',
    borderColor: 'transparent',
  },
};

export type ButtonType = keyof typeof ButtonTheme;

export const Button = ({
  label,
  loading,
  icon,
  fontSize,
  hapticable = true,
  type = 'default',
  onPress,
  ...xStackProps
}: XStackProps & {
  loading?: boolean;
  label?: string;
  fontSize?: number;
  hapticable?: boolean;
  icon?: ReactElement<{ color?: string; size?: number }>;
  color?: ColorTokens;
  type?: ButtonType;
}) => {
  const theme = useTheme();
  const disabled = xStackProps.disabled || loading;
  const themeConfig = ButtonTheme[type];
  const color =
    theme[xStackProps.color || themeConfig.color]?.val || themeConfig.color;
  const backgroundColor =
    theme[themeConfig.backgroundColor]?.val || themeConfig.backgroundColor;
  const borderColor =
    theme[themeConfig.borderColor]?.val || themeConfig.borderColor;

  return (
    <XStack
      backgroundColor={backgroundColor}
      borderColor={borderColor}
      borderWidth={2}
      borderRadius="$10"
      justifyContent="center"
      alignItems="center"
      paddingVertical="$1"
      paddingHorizontal="$6"
      minHeight={46}
      width="100%"
      gap="$3"
      disabled={disabled}
      disabledStyle={{
        cursor: 'auto',
        opacity: 0.5,
      }}
      {...xStackProps}
      {...(onPress && {
        cursor: 'pointer',
        pressStyle: { opacity: 0.8 },
        onPress: (e) => {
          hapticable && emitHaptic();
          onPress?.(e);
        },
      })}
    >
      {loading ? (
        <Spinner color={color} size="small" />
      ) : (
        <>
          {!!icon &&
            cloneElement(icon, {
              color,
            })}

          {!!label && (
            <MediumText
              textAlign={!icon ? 'center' : 'left'}
              fontSize={fontSize}
              color={color}
            >
              {label}
            </MediumText>
          )}
        </>
      )}
    </XStack>
  );
};

export const ButtonIcon = ({
  iconName,
  iconSize = 18,
  iconStyle,
  hapticable = true,
  loading,
  size = 30,
  type = 'default',
  onPress,
  ...viewProps
}: ViewProps & {
  iconName: IconName;
  iconSize?: number;
  iconStyle?: ViewStyle;
  loading?: boolean;
  hapticable?: boolean;
  size?: number;
  color?: string;
  type?: ButtonType;
}) => {
  const theme = useTheme();
  const disabled = viewProps.disabled || loading;
  const themeConfig = ButtonTheme[type];
  const color =
    theme[viewProps.color || themeConfig.color]?.val || themeConfig.color;
  const backgroundColor =
    theme[themeConfig.backgroundColor]?.val || themeConfig.backgroundColor;
  const borderColor =
    theme[themeConfig.borderColor]?.val || themeConfig.borderColor;

  return (
    <View
      borderRadius="100%"
      justifyContent="center"
      alignItems="center"
      width={size}
      height={size}
      backgroundColor={backgroundColor}
      borderColor={borderColor}
      borderWidth={2}
      disabledStyle={{
        cursor: 'auto',
        opacity: 0.5,
      }}
      disabled={disabled}
      {...viewProps}
      {...(onPress && {
        cursor: 'pointer',
        pressStyle: { opacity: 0.8 },
        onPress: (e) => {
          hapticable && emitHaptic();
          onPress?.(e);
        },
      })}
    >
      {loading ? (
        <Spinner color={color} size="small" />
      ) : (
        <Icon color={color} name={iconName} size={iconSize} style={iconStyle} />
      )}
    </View>
  );
};
