import { ViewProps, XStack } from 'tamagui';
import { compactViewStyles } from '../view/compact-view';
import { Card } from './card';
import { CircularProgress } from '../chart/circular-progress';
import { defaultIconSize } from '../icons';
import { RegularText } from '../text/text';
import { ButtonIcon } from '../button/button';

export const ProgressCard = ({
  children,
  progress,
  subtitle,
  onClose,
}: ViewProps & {
  progress: number;
  subtitle?: string;
  onClose: () => void;
}) => {
  return (
    <Card style={compactViewStyles} gap="$3">
      <XStack gap="$3">
        <CircularProgress
          progress={progress}
          title={`${progress}%`}
          titleFontSize={14}
          delay={300}
          radius={60}
        />

        {!!subtitle && (
          <RegularText flex={1} lineHeight={defaultIconSize}>
            {subtitle}
          </RegularText>
        )}

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
