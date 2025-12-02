import React, { cloneElement, memo, ReactElement, useCallback } from 'react';
import {
  ColorTokens,
  TextProps,
  View,
  ViewProps,
  XStack,
  XStackProps,
} from 'tamagui';
import { MediumText, RegularText } from '../text/text';
import { Card } from '../card/card';
import { emitHaptic } from '@symbiot-core-apps/shared';
import { GestureResponderEvent } from 'react-native';
import { defaultIconSize } from '../icons';

export const ListItemGroup = memo(
  (props: ViewProps & { title?: string; titleProps?: TextProps }) => {
    return (
      <View gap="$1" width="100%">
        {!!props.title && (
          <MediumText
            color="$placeholderColor"
            marginHorizontal="$3"
            {...props.titleProps}
          >
            {props.title}
          </MediumText>
        )}

        <Card paddingVertical="$2" gap="$2" {...props} />
      </View>
    );
  },
);

export const ListItem = memo(
  ({
    label,
    text,
    icon,
    iconAfter,
    color,
    disabled,
    iconSize,
    labelNumberOfLines = 2,
    textNumberOfLines = 1,
    onPress,
    ...xStackProps
  }: XStackProps & {
    label: string;
    text?: string;
    icon?: false | ReactElement<{ color?: string; size?: number }>;
    iconAfter?: false | ReactElement<{ color?: string; size?: number }>;
    iconSize?: number;
    labelNumberOfLines?: number;
    textNumberOfLines?: number;
    color?: ColorTokens;
  }) => {
    const adjustedColor = disabled ? '$disabled' : color;

    const onXStackPress = useCallback(
      (e: GestureResponderEvent) => {
        if (disabled) return;

        if (onPress) {
          onPress?.(e);
          emitHaptic();
        }
      },
      [disabled, onPress],
    );

    return (
      <XStack
        alignItems="center"
        gap="$4"
        paddingVertical="$2"
        disabled={disabled}
        {...xStackProps}
        {...(onPress && {
          pressStyle: { opacity: 0.8 },
          cursor: 'pointer',
          onPress: onXStackPress,
        })}
      >
        {!!icon &&
          cloneElement(icon, {
            color: adjustedColor,
            size: iconSize,
          })}

        <View flex={1} justifyContent="center">
          {!!label && (
            <RegularText
              lineHeight={defaultIconSize}
              numberOfLines={labelNumberOfLines}
              color={adjustedColor}
            >
              {label}
            </RegularText>
          )}

          {!!text && (
            <RegularText
              fontSize={12}
              numberOfLines={textNumberOfLines}
              color="$placeholderColor"
            >
              {text}
            </RegularText>
          )}
        </View>

        {!!iconAfter &&
          cloneElement(iconAfter, {
            color: adjustedColor,
            size: iconSize,
          })}
      </XStack>
    );
  },
);
