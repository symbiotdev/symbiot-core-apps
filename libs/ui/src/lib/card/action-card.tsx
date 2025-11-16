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
  buttonHidden,
  onPress,
  ...otherProps
}: ViewProps & {
  title: string;
  subtitle: string;
  buttonLabel: string;
  buttonIcon: ReactElement<{ color?: string; size?: number }>;
  buttonType?: ButtonType;
  buttonLoading?: boolean;
  buttonHidden?: boolean;
}) => {
  return (
    <ActionCardWithCustomButton
      {...otherProps}
      button={
        !buttonHidden ? (
          <Button
            marginTop="$2"
            label={buttonLabel}
            icon={buttonIcon}
            type={buttonType}
            loading={buttonLoading}
            onPress={onPress}
          />
        ) : undefined
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
  button?: ReactElement;
}) => {
  return (
    <Card gap="$2" width="100%" {...viewProps}>
      <SemiBoldText fontSize={18}>{title}</SemiBoldText>
      <RegularText marginBottom="$2">{subtitle}</RegularText>
      {button}
    </Card>
  );
};
