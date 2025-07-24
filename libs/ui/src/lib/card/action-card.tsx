import { Card } from './card';
import { ReactElement } from 'react';
import { H2 } from '../text/heading';
import { RegularText } from '../text/text';
import { Button } from '../button/button';
import { ViewProps, XStack } from 'tamagui';

export const ActionCard = ({
  title,
  subtitle,
  buttonLabel,
  Icon,
  onActionPress,
  ...viewProps
}: ViewProps & {
  title: string;
  subtitle: string;
  buttonLabel: string;
  Icon: ReactElement;
  onActionPress: () => void;
}) => {
  return (
    <Card gap="$3" maxWidth={564} width="100%" {...viewProps}>
      <XStack gap="$2" alignItems="center">
        {Icon}
        <H2>{title}</H2>
      </XStack>
      <RegularText>{subtitle}</RegularText>
      <Button marginTop="$2" label={buttonLabel} onPress={onActionPress} />
    </Card>
  );
};
