import { View } from 'tamagui';
import { RegularText } from '../text/text';

const sizeConfig = {
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

export const Chip = ({
  label,
  size = 'medium',
}: {
  label: string;
  size?: keyof typeof sizeConfig;
}) => {
  const config = sizeConfig[size];

  return (
    <View
      backgroundColor="$background"
      paddingHorizontal={config.paddingHorizontal}
      paddingVertical={config.paddingVertical}
      borderRadius="$10"
    >
      <RegularText fontSize={config.fontSize} opacity={0.5}>
        {label}
      </RegularText>
    </View>
  );
};
