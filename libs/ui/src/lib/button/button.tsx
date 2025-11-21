import { cloneElement, memo, ReactElement } from 'react';
import { MediumText } from '../text/text';
import { ColorTokens, View, ViewProps, XStack, XStackProps } from 'tamagui';
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

export const Button = memo(
  ({
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
    const disabled = xStackProps.disabled || loading;
    const color = xStackProps.color || ButtonTheme[type].color;

    return (
      <XStack
        backgroundColor={ButtonTheme[type].backgroundColor}
        borderColor={ButtonTheme[type].borderColor}
        borderWidth={2}
        borderRadius="$10"
        justifyContent="center"
        alignItems="center"
        padding="$3"
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
  },
);

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
  const color = viewProps.color || ButtonTheme[type].color;
  const disabled = viewProps.disabled || loading;

  return (
    <View
      borderRadius="100%"
      justifyContent="center"
      alignItems="center"
      width={size}
      height={size}
      backgroundColor={ButtonTheme[type].backgroundColor}
      borderColor={ButtonTheme[type].borderColor}
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
