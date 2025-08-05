import { cloneElement, memo, ReactElement, useCallback } from 'react';
import { ColorTokens, View, ViewProps, XStack, XStackProps } from 'tamagui';
import { RegularText } from '../text/text';
import { H5 } from '../text/heading';
import { Card } from '../card/card';
import { emitHaptic } from '@symbiot-core-apps/shared';
import { GestureResponderEvent } from 'react-native';

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
    icon?: false | ReactElement<{ color?: string; size?: number }>;
    iconAfter?: false | ReactElement<{ color?: string; size?: number }>;
    iconSize?: number;
    color?: ColorTokens;
  }) => {
    const adjustedColor = disabled ? '$disabled' : color;

    const onXStackPress = useCallback(
      (e: GestureResponderEvent) => {
        if (onPress) {
          onPress?.(e);
          emitHaptic();
        }
      },
      [onPress],
    );

    return (
      <XStack
        alignItems="center"
        gap="$4"
        paddingVertical="$2"
        pressStyle={!disabled && { opacity: 0.8 }}
        cursor={onPress && !disabled ? 'pointer' : 'auto'}
        onPress={onXStackPress}
        {...xStackProps}
      >
        {!!icon &&
          cloneElement(icon, {
            color: adjustedColor,
            size: iconSize,
          })}

        <RegularText flex={1} numberOfLines={2} color={adjustedColor}>
          {label}
        </RegularText>

        {!!iconAfter &&
          cloneElement(iconAfter, {
            color: adjustedColor,
            size: iconSize || 18,
          })}
      </XStack>
    );
  },
);
