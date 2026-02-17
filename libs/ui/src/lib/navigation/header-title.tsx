import { MediumText, RegularText } from '../text/text';
import { View } from 'tamagui';

export const HeaderTitle = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) => (
  <View gap={2} paddingHorizontal={5}>
    <MediumText numberOfLines={subtitle ? 1 : 2} textAlign="center">
      {title}
    </MediumText>

    {!!subtitle && (
      <RegularText
        color="$disabled"
        textAlign="center"
        numberOfLines={1}
        fontSize={12}
      >
        {subtitle}
      </RegularText>
    )}
  </View>
);
