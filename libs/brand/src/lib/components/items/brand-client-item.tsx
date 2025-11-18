import { emitHaptic } from '@symbiot-core-apps/shared';
import {
  Avatar,
  FormView,
  Icon,
  MediumText,
  RegularText,
} from '@symbiot-core-apps/ui';
import { View, ViewProps } from 'tamagui';
import { BrandClient } from '@symbiot-core-apps/api';

export const BrandClientItem = ({
  client,
  hideArrow,
  subtitle,
  subtitleColor,
  onPress,
  ...viewProps
}: ViewProps & {
  hideArrow?: boolean;
  subtitle?: string;
  subtitleColor?: string;
  client: BrandClient;
}) => (
  <FormView
    alignItems="center"
    gap="$4"
    flexDirection="row"
    disabledStyle={{ opacity: 0.5 }}
    pressStyle={{ opacity: 0.8 }}
    onPress={(e) => {
      emitHaptic();
      onPress?.(e);
    }}
    {...(!viewProps.disabled && {
      cursor: 'pointer',
    })}
    {...viewProps}
  >
    <Avatar
      name={`${client.firstname} ${client.lastname}`}
      size={40}
      url={client.avatar?.xsUrl}
    />

    <View gap="$1" flex={1}>
      <MediumText numberOfLines={1} flex={1}>
        {`${client.firstname} ${client.lastname}`}
      </MediumText>

      {!!subtitle && (
        <RegularText
          color={subtitleColor || '$placeholderColor'}
          numberOfLines={1}
          lineHeight={20}
        >
          {subtitle}
        </RegularText>
      )}
    </View>

    {!hideArrow && <Icon name="ArrowRight" />}
  </FormView>
);
