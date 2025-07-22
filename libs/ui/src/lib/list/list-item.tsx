import { cloneElement, memo, ReactElement } from 'react';
import { ColorTokens, View, ViewProps, XStack, XStackProps } from 'tamagui';
import { RegularText } from '../text/text';
import { H5 } from '../text/heading';
import { Card } from '../card/card';

export const ListItemGroup = memo((props: ViewProps & { title?: string }) => {
  return (
    <View gap="$1">
      {!!props.title && (
        <H5 textTransform="uppercase" color="$disabled" marginHorizontal="$3">
          {props.title}
        </H5>
      )}
      <Card
        backgroundColor="$background1"
        paddingVertical="$2"
        gap="$2"
        {...props}
      />
    </View>
  );
});

export const ListItem = memo(
  ({
    label,
    icon,
    iconAfter,
    color,
    disabled,
    iconSize,
    onPress,
    ...xStackProps
  }: XStackProps & {
    label: string;
    icon?: ReactElement<{ color?: string; size?: number }>;
    iconAfter?: ReactElement<{ color?: string; size?: number }>;
    iconSize?: number;
    color?: ColorTokens;
  }) => {
    return (
      <XStack
        alignItems="center"
        gap="$4"
        paddingVertical="$2"
        pressStyle={!disabled && { opacity: 0.8 }}
        cursor={onPress && !disabled ? 'pointer' : 'auto'}
        onPress={onPress}
        {...xStackProps}
      >
        {!!icon &&
          cloneElement(icon, {
            color,
            size: iconSize,
          })}

        <RegularText flex={1} numberOfLines={2} color={color}>
          {label}
        </RegularText>

        {!!iconAfter &&
          cloneElement(iconAfter, {
            color,
            size: iconSize || 18,
          })}
      </XStack>
    );
  },
);
