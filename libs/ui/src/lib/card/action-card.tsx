import { Card } from './card';
import { ReactElement } from 'react';
import { RegularText, SemiBoldText } from '../text/text';
import { Button, ButtonType } from '../button/button';
import { ViewProps } from 'tamagui';

export const ActionCard = ({
  buttonLabel,
  buttonIcon,
  buttonType,
  buttonLoading,
  onPress,
  ...otherProps
}: ViewProps & {
  title: string;
  subtitle: string;
  buttonLabel: string;
  buttonIcon: ReactElement<{ color?: string; size?: number }>;
  buttonType?: ButtonType;
  buttonLoading?: boolean;
}) => {
  return (
    <ActionCardWithCustomButton
      {...otherProps}
      button={
        <Button
          marginTop="$2"
          label={buttonLabel}
          icon={buttonIcon}
          type={buttonType}
          loading={buttonLoading}
          onPress={onPress}
        />
      }
    />
  );
};

export const ActionCardWithCustomButton = ({
  title,
  subtitle,
  button,
  ...viewProps
}: ViewProps & {
  title: string;
  subtitle: string;
  button: ReactElement;
}) => {
  return (
    <Card gap="$2" width="100%" {...viewProps}>
      <SemiBoldText fontSize={18}>{title}</SemiBoldText>
      <RegularText marginBottom="$2">{subtitle}</RegularText>
      {button}
    </Card>
  );
};
