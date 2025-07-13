import { cloneElement, memo, ReactElement } from 'react';
import { MediumText } from '../text/text';
import { ColorTokens, XStack, XStackProps } from 'tamagui';
import { Spinner } from '../loading/spinner';

export const Button = memo(
  ({
    label,
    loading,
    icon,
    type,
    ...xStackProps
  }: XStackProps & {
    loading?: boolean;
    label?: string;
    icon?: ReactElement<{ color?: string; size?: number }>;
    color?: ColorTokens;
    type?: 'outlined';
  }) => {
    const disabled = xStackProps.disabled || loading;
    const color =
      xStackProps.color || (type === 'outlined' ? '$color' : '$color1');
    const backgroundColor = !type ? '$color' : 'transparent';
    const borderWidth = type === 'outlined' ? 1.5 : 0;
    const borderColor = '$color';

    return (
      <XStack
        backgroundColor={backgroundColor}
        borderWidth={borderWidth}
        borderColor={borderColor}
        borderRadius="$10"
        justifyContent="center"
        alignItems="center"
        padding="$3"
        minHeight={44}
        maxWidth={400}
        width="100%"
        gap="$3"
        {...xStackProps}
        disabled={disabled}
        cursor={disabled ? 'auto' : 'pointer'}
        opacity={disabled ? 0.9 : 1}
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
  }
);
