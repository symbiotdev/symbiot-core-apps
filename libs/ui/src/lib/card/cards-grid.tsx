import { ColorTokens, View, ViewProps } from 'tamagui';
import { useState } from 'react';
import { emitHaptic } from '@symbiot-core-apps/shared';
import { BoldText, MediumText, RegularText } from '../text/text';
import { defaultIconSize, Icon, IconName } from '../icons';
import { StyleSheet, View as RNView } from 'react-native';

type CardGridItem = {
  label: string;
  text?: string;
  disabled?: boolean;
  hidden?: boolean;
  iconName?: IconName;
  iconSize?: number;
  labelNumberOfLines?: number;
  textNumberOfLines?: number;
  color?: ColorTokens;
  onPress?: () => void;
};

export const CardsGrid = ({
  title,
  items,
}: {
  title?: string;
  items: CardGridItem[];
  numberOfColumns?: number;
}) => {
  const [width, setWidth] = useState(0);
  const cardWidth = (width + 8) / (width > 450 ? 3 : 2) - 8;

  return (
    <RNView
      style={{ gap: 4 }}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
    >
      {!!title && (
        <MediumText color="$placeholderColor" marginHorizontal="$3">
          {title}
        </MediumText>
      )}

      <View flexDirection="row" flexWrap="wrap" flex={1} gap={8} width={width}>
        {items.map(
          (item, index) =>
            !item.hidden && (
              <GridItem key={index} {...item} width={cardWidth} />
            ),
        )}
      </View>
    </RNView>
  );
};

const GridItem = ({
  label,
  text,
  iconName,
  color,
  disabled,
  iconSize,
  labelNumberOfLines = 2,
  textNumberOfLines = 1,
  onPress,
  ...viewProps
}: ViewProps & CardGridItem) => (
  <View
    padding="$4"
    borderRadius="$10"
    borderWidth={2}
    borderColor="rgba(160,160,160,0.2)"
    borderStyle="dashed"
    cursor="pointer"
    position="relative"
    overflow="hidden"
    disabled={disabled}
    disabledStyle={{ opacity: 0.5 }}
    pressStyle={{ opacity: 0.8 }}
    {...viewProps}
    onPress={(e) => {
      onPress?.(e);
      emitHaptic();
    }}
  >
    <View
      style={StyleSheet.absoluteFillObject}
      borderRadius="$10"
      backgroundColor="rgba(210,210,210,0.1)"
    />

    {!!iconName && (
      <Icon name={iconName} size={iconSize} style={{ opacity: 0.9 }} />
    )}

    <View marginTop="auto">
      <BoldText
        marginTop="$2"
        lineHeight={defaultIconSize}
        numberOfLines={labelNumberOfLines}
        color={color}
      >
        {label}
      </BoldText>

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
  </View>
);
