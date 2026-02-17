import { BaseSyntheticEvent, memo } from 'react';
import { Pressable } from 'react-native';
import { emitHaptic } from '@symbiot-core-apps/shared';
import { Icon, IconName } from '../icons';
import { AttentionView } from '../view/attention-view';

export const HeaderButton = memo(
  ({
    attention,
    iconName,
    onPress,
  }: {
    iconName: IconName;
    attention?: boolean;
    onPress?: (e: BaseSyntheticEvent) => void;
  }) => (
    <AttentionView
      width={40}
      height={40}
      justifyContent="center"
      alignItems="center"
      attention={Boolean(attention)}
    >
      <Pressable
        style={({ pressed }) => ({
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          opacity: pressed ? 0.8 : 1,
          outlineWidth: 0,
        })}
        onPress={(e) => {
          onPress?.(e);
          emitHaptic();
        }}
      >
        <Icon name={iconName} color="$buttonTextColor1" />
      </Pressable>
    </AttentionView>
  ),
);
