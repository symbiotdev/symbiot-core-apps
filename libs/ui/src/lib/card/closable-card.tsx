import { ViewProps, XStack } from 'tamagui';
import { compactViewStyles } from '../view/compact-view';
import { Card } from './card';
import { ButtonIcon } from '../button/button';
import { RegularText } from '../text/text';
import { H3 } from '../text/heading';
import { DEFAULT_ICON_SIZE, Icon, IconName } from '@symbiot-core-apps/ui2';

export const ClosableCard = ({
  iconName,
  title,
  subtitle,
  onClose,
}: ViewProps & {
  title: string;
  subtitle?: string;
  iconName?: IconName;
  onClose: () => void;
}) => {
  return (
    <Card style={compactViewStyles} gap="$2">
      <XStack alignItems="flex-start" justifyContent="space-between" gap="$3">
        {!!iconName && <Icon name={iconName} />}

        <H3 flex={1} lineHeight={DEFAULT_ICON_SIZE}>
          {title}
        </H3>

        <ButtonIcon
          iconName="Close"
          type="clear"
          marginRight={-10}
          marginTop={-10}
          onPress={onClose}
        />
      </XStack>

      {!!subtitle && (
        <RegularText lineHeight={DEFAULT_ICON_SIZE}>{subtitle}</RegularText>
      )}
    </Card>
  );
};
