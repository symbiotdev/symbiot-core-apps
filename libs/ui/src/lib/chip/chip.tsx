import { View } from 'tamagui';
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
};

export const Chip = ({
  label,
  size = 'medium',
  type = 'default',
}: {
  label: string;
  size?: keyof typeof _sizeConfig;
  type?: keyof typeof _typeConfig;
}) => {
  const sizeConfig = _sizeConfig[size];
  const typeConfig = _typeConfig[type];

  return (
    <View
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
