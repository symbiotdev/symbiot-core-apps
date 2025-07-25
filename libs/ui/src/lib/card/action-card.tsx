import { Card } from './card';
import { ReactElement } from 'react';
import { H3 } from '../text/heading';
import { RegularText } from '../text/text';
import { Button } from '../button/button';
import { ViewProps } from 'tamagui';

export const ActionCard = ({
  title,
  subtitle,
  buttonLabel,
  buttonIcon,
  onActionPress,
  ...viewProps
}: ViewProps & {
  title: string;
  subtitle: string;
  buttonLabel: string;
  buttonIcon: ReactElement<{ color?: string; size?: number }>;
  onActionPress: () => void;
}) => {
  return (
    <Card gap="$3" width="100%" {...viewProps}>
      <H3>{title}</H3>
      <RegularText>{subtitle}</RegularText>
      <Button
        marginTop="$2"
        label={buttonLabel}
        icon={buttonIcon}
        onPress={onActionPress}
      />
    </Card>
  );
};
