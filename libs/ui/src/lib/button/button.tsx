import { cloneElement, memo, ReactElement } from 'react';
import { RegularText } from '../text/text';
import { ColorTokens, XStack, XStackProps } from 'tamagui';
import { Spinner } from '../loading/spinner';

export const Button = memo(
  ({
    label,
    loading,
    icon,
    ...xStackProps
  }: XStackProps & {
    loading?: boolean;
    label?: string;
    icon?: ReactElement<{ color?: string; size?: string }>;
    color?: ColorTokens;
  }) => {
    const disabled = xStackProps.disabled || loading;
    const color = xStackProps.color || '$color1';

    return (
      <XStack
        backgroundColor="$color"
        borderRadius="$4"
        justifyContent="center"
        alignItems="center"
        padding="$3"
        gap="$2"
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

            {!!label && <RegularText color={color}>{label}</RegularText>}
          </>
        )}
      </XStack>
    );
  }
);
