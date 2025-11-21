import { View, ViewProps } from 'tamagui';
import { RegularText } from '../text/text';

const _sizeConfig = {
  small: {
    fontSize: 12,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  medium: {
    fontSize: 14,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  large: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
};

const _typeConfig = {
  default: {
    backgroundColor: '$background',
    textColor: '$color',
  },
  danger: {
    backgroundColor: '$background1',
    textColor: '$error',
  },
  highlighted: {
    backgroundColor: '$background1',
    textColor: '$color',
  },
};

export type ChipType = keyof typeof _typeConfig;
export type ChipSize = keyof typeof _sizeConfig;

export const Chip = ({
  label,
  size = 'medium',
  type = 'default',
  ...viewProps
}: ViewProps & {
  label: string;
  type?: ChipType;
  size?: ChipSize;
}) => {
  const sizeConfig = _sizeConfig[size];
  const typeConfig = _typeConfig[type];

  return (
    <View
      {...viewProps}
      flex={0}
      backgroundColor={typeConfig.backgroundColor}
      paddingHorizontal={sizeConfig.paddingHorizontal}
      paddingVertical={sizeConfig.paddingVertical}
      borderRadius="$10"
    >
      <RegularText
        numberOfLines={1}
        fontSize={sizeConfig.fontSize}
        color={typeConfig.textColor}
        opacity={0.5}
      >
        {label}
      </RegularText>
    </View>
  );
};
