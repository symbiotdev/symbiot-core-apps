import { Card } from './card';
import { ReactElement } from 'react';
import { RegularText, SemiBoldText } from '../text/text';
import { Button, ButtonType } from '../button/button';
import { ViewProps } from 'tamagui';

export const ActionCard = ({
  title,
  subtitle,
  buttonLabel,
  buttonIcon,
  buttonType,
  buttonLoading,
  onActionPress,
  ...viewProps
}: ViewProps & {
  title: string;
  subtitle: string;
  buttonLabel: string;
  buttonIcon: ReactElement<{ color?: string; size?: number }>;
  buttonType?: ButtonType;
  buttonLoading?: boolean;
  onActionPress: () => void;
}) => {
  return (
    <Card gap="$2" width="100%" {...viewProps}>
      <SemiBoldText fontSize={18}>{title}</SemiBoldText>
      <RegularText>{subtitle}</RegularText>
      <Button
        marginTop="$2"
        label={buttonLabel}
        icon={buttonIcon}
        type={buttonType}
        loading={buttonLoading}
        onPress={onActionPress}
      />
    </Card>
  );
};
