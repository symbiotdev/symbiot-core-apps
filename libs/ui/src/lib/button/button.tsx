import { cloneElement, memo, ReactElement } from 'react';
import { MediumText } from '../text/text';
import { ColorTokens, View, ViewProps, XStack, XStackProps } from 'tamagui';
import { Spinner } from '../loading/spinner';
import { emitHaptic } from '@symbiot-core-apps/shared';
import { Icon } from '../icons';
import { IconName } from '../icons/config';

export const ButtonTheme = {
  default: {
    color: '$buttonTextColor',
    backgroundColor: '$buttonBackground',
    borderWidth: 0,
    borderColor: 'transparent',
  },
  clear: {
    color: '$buttonTextColor1',
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderColor: 'transparent',
  },
  outlined: {
    color: '$buttonTextColor1',
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '$buttonBackground',
  },
  danger: {
    color: '$buttonTextColor',
    backgroundColor: '$error',
    borderWidth: 0,
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
        borderWidth={ButtonTheme[type].borderWidth}
        borderColor="$buttonBackground"
        borderRadius="$10"
        justifyContent="center"
        alignItems="center"
        padding="$3"
        paddingHorizontal="$6"
        minHeight={46}
        width="100%"
        gap="$3"
        cursor={xStackProps.disabled ? 'auto' : 'pointer'}
        pressStyle={{ opacity: 0.8 }}
        disabledStyle={{
          cursor: 'auto',
          opacity: 0.8,
          backgroundColor: '$disabled',
        }}
        {...xStackProps}
        disabled={disabled}
        onPress={(e) => {
          onPress?.(e);
          hapticable && emitHaptic();
        }}
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
              <MediumText fontSize={fontSize} color={color}>
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
  iconSize,
  hapticable = true,
  loading,
  size = 30,
  type = 'default',
  onPress,
  ...viewProps
}: ViewProps & {
  iconName: IconName;
  iconSize?: number;
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
      cursor="pointer"
      width={size}
      height={size}
      pressStyle={{ opacity: 0.8 }}
      backgroundColor={ButtonTheme[type].backgroundColor}
      borderWidth={ButtonTheme[type].borderWidth}
      {...viewProps}
      disabled={disabled}
      onPress={(e) => {
        onPress?.(e);
        hapticable && emitHaptic();
      }}
    >
      {loading ? (
        <Spinner color={color} size="small" />
      ) : (
        <Icon color={color} name={iconName} size={iconSize} />
      )}
    </View>
  );
};
