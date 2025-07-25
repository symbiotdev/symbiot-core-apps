import { cloneElement, memo, ReactElement } from 'react';
import { MediumText } from '../text/text';
import { ColorTokens, XStack, XStackProps } from 'tamagui';
import { Spinner } from '../loading/spinner';

export type ButtonType = 'default' | 'outlined' | 'danger';

export const ButtonTheme = {
  default: {
    color: '$buttonTextColor',
    backgroundColor: '$buttonBackground',
    borderWidth: 0,
    borderColor: 'transparent',
  },
  danger: {
    color: '$buttonTextColor',
    backgroundColor: '$error',
    borderWidth: 0,
    borderColor: 'transparent',
  },
  outlined: {
    color: '$buttonTextColor1',
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '$buttonBackground',
  },
};

export const Button = memo(
  ({
    label,
    loading,
    icon,
    type = 'default',
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
        cursor="auto"
        pressStyle={{ opacity: 0.8 }}
        disabledStyle={{
          cursor: 'auto',
          opacity: 0.8,
          backgroundColor: '$disabled',
        }}
        {...xStackProps}
        disabled={disabled}
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
