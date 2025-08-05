import { cloneElement, memo, ReactElement } from 'react';
import { MediumText } from '../text/text';
import { ColorTokens, XStack, XStackProps } from 'tamagui';
import { Spinner } from '../loading/spinner';
import { emitHaptic } from '@symbiot-core-apps/shared';

export type ButtonType = 'default' | 'outlined' | 'clear' | 'danger';

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

export const Button = memo(
  ({
    label,
    loading,
    icon,
    type = 'default',
    onPress,
    ...xStackProps
  }: XStackProps & {
    loading?: boolean;
    label?: string;
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
          emitHaptic();
        }}
      >
        {loading ? (
          <Spinner color={color} />
        ) : (
          <>
            {!!icon &&
              cloneElement(icon, {
                color,
              })}

            {!!label && <MediumText color={color}>{label}</MediumText>}
          </>
        )}
      </XStack>
    );
  },
);
