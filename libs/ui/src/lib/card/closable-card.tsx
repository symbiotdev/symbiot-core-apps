import { ViewProps, XStack } from 'tamagui';
import { formViewStyles } from '../view/form-view';
import { IconName } from '../icons/config';
import { defaultIconSize, Icon } from '../icons';
import { Card } from './card';
import { ButtonIcon } from '../button/button';
import { RegularText } from '../text/text';
import { H3 } from '../text/heading';

const ClosableCard = ({
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
    <Card style={formViewStyles} gap="$2">
      <XStack alignItems="flex-start" justifyContent="space-between" gap="$3">
        {!!iconName && <Icon name={iconName} />}

        <H3 flex={1} lineHeight={defaultIconSize}>
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
        <RegularText lineHeight={defaultIconSize}>{subtitle}</RegularText>
      )}
    </Card>
  );
};
export default ClosableCard;
