import { BaseSyntheticEvent, memo } from 'react';
import { Pressable } from 'react-native';
import { emitHaptic } from '@symbiot-core-apps/shared';
import { Icon, IconName } from '../../icon/icon';
import { AttentionView } from '../../appearance/attention-view';

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
    <Pressable
      style={({ pressed }) => ({
        minWidth: 40,
        minHeight: 40,
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
      <AttentionView dotOffset={-1} active={Boolean(attention)}>
        <Icon name={iconName} />
      </AttentionView>
    </Pressable>
  ),
);
