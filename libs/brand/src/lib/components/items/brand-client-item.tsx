import { emitHaptic } from '@symbiot-core-apps/shared';
import {
  Avatar,
  FrameView,
  Icon,
  MediumText,
  RegularText,
  Spinner,
} from '@symbiot-core-apps/ui';
import { View, ViewProps } from 'tamagui';
import { BrandClient } from '@symbiot-core-apps/api';

export const BrandClientItem = ({
  client,
  hideArrow,
  loading,
  subtitle,
  subtitleColor,
  onPress,
  ...viewProps
}: ViewProps & {
  hideArrow?: boolean;
  loading?: boolean;
  subtitle?: string;
  subtitleColor?: string;
  client: BrandClient;
}) => {
  const disabled = !!viewProps.disabled || loading;

  return (
    <FrameView
      alignItems="center"
      gap="$4"
      flexDirection="row"
      disabled={disabled}
      disabledStyle={{ opacity: 0.5 }}
      {...viewProps}
      {...(onPress &&
        !disabled && {
          cursor: 'pointer',
          pressStyle: { opacity: 0.8 },
          onPress: (e) => {
            emitHaptic();
            onPress?.(e);
          },
        })}
    >
      <Avatar
        name={`${client.firstname} ${client.lastname}`}
        size={40}
        url={client.avatar?.xsUrl}
      />

      <View gap="$1" flex={1}>
        <MediumText numberOfLines={1}>
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

      {!!loading && <Spinner />}

      {!hideArrow && !loading && <Icon name="ArrowRight" />}
    </FrameView>
  );
};
