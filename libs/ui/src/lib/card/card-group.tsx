import { ColorTokens, View, ViewProps, XStack } from 'tamagui';
import { cloneElement, ReactElement } from 'react';
import { emitHaptic } from '@symbiot-core-apps/shared';
import { RegularText } from '../text/text';
import { defaultIconSize } from '../icons';
import { H5 } from '../text/heading';
import { FormView } from '../view/form-view';

export const CardGroup = ({
  title,
  children,
  ...props
}: ViewProps & { title?: string }) => (
  <FormView gap="$1" width="100%" {...props}>
    {!!title && (
      <H5 textTransform="uppercase" color="$disabled" marginHorizontal="$4">
        {title}
      </H5>
    )}

    <XStack flexWrap="wrap" gap="$4" flex={1}>
      {children}
    </XStack>
  </FormView>
);

export const CardGroupItem = ({
  label,
  text,
  icon,
  color,
  disabled,
  iconSize = 30,
  labelNumberOfLines = 2,
  textNumberOfLines = 1,
  onPress,
  ...viewProps
}: ViewProps & {
  label: string;
  text?: string;
  icon?: false | ReactElement<{ color?: string; size?: number }>;
  iconSize?: number;
  labelNumberOfLines?: number;
  textNumberOfLines?: number;
  color?: ColorTokens;
}) => (
  <View
    alignItems="center"
    justifyContent="center"
    padding="$2"
    backgroundColor="$background1"
    borderRadius="$10"
    cursor="pointer"
    flex={1}
    minHeight={100}
    minWidth={130}
    disabled={disabled}
    disabledStyle={{ opacity: 0.5 }}
    pressStyle={{ opacity: 0.8 }}
    {...viewProps}
    onPress={(e) => {
      onPress?.(e);
      emitHaptic();
    }}
  >
    {!!icon &&
      cloneElement(icon, {
        color,
        size: iconSize,
      })}

    {!!label && (
      <RegularText
        marginTop="$1"
        textAlign="center"
        lineHeight={defaultIconSize}
        numberOfLines={labelNumberOfLines}
        color={color}
      >
        {label}
      </RegularText>
    )}

    {!!text && (
      <RegularText
        fontSize={12}
        marginTop={!label ? '$1' : undefined}
        textAlign="center"
        numberOfLines={textNumberOfLines}
        color="$placeholderColor"
      >
        {text}
      </RegularText>
    )}
  </View>
);
