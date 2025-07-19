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
      xStackProps.color ||
      (type === 'outlined' ? '$buttonTextColor1' : '$buttonTextColor');
    const backgroundColor = !type ? '$buttonBackground' : 'transparent';
    const borderWidth = type === 'outlined' ? 1.5 : 0;
    const borderColor = '$buttonBackground';

    return (
      <XStack
        backgroundColor={backgroundColor}
        borderWidth={borderWidth}
        borderColor={borderColor}
        borderRadius="$10"
        justifyContent="center"
        alignItems="center"
        padding="$3"
        minHeight={46}
        width="100%"
        gap="$3"
        cursor="auto"
        pressStyle={{ opacity: 0.9 }}
        disabledStyle={{
          cursor: 'auto',
          opacity: 0.9,
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
  }
);
