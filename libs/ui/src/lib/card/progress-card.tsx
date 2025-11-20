import { View, ViewProps, XStack } from 'tamagui';
import { formViewStyles } from '../view/form-view';
import { Card } from './card';
import { CircularProgress } from '../chart/circular-progress';
import { defaultIconSize } from '../icons';
import { H3 } from '../text/heading';
import { RegularText } from '../text/text';
import { ButtonIcon } from '../button/button';

export const ProgressCard = ({
  children,
  progress,
  title,
  subtitle,
  onClose,
}: ViewProps & {
  progress: number;
  title: string;
  subtitle?: string;
  onClose: () => void;
}) => {
  return (
    <Card style={formViewStyles} gap="$3">
      <XStack gap="$2">
        <CircularProgress
          progress={progress}
          title={`${progress}%`}
          titleFontSize={14}
          delay={300}
          radius={60}
        />

        <View gap="$1" flex={1}>
          <H3 lineHeight={defaultIconSize}>{title}</H3>

          {!!subtitle && (
            <RegularText lineHeight={defaultIconSize}>{subtitle}</RegularText>
          )}
        </View>

        <ButtonIcon
          iconName="Close"
          type="clear"
          marginRight={-10}
          marginTop={-10}
          onPress={onClose}
        />
      </XStack>

      {children}
    </Card>
  );
};
