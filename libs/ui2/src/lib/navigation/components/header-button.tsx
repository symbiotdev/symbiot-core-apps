import { BaseSyntheticEvent, memo } from 'react';
import { Pressable } from 'react-native';
import { emitHaptic } from '@symbiot-core-apps/shared';
import { Icon, IconName } from '../../icon/icon';
import { Attention } from '../../appearance/attention';

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
      <Attention dotOffset={-1} active={Boolean(attention)}>
        <Icon name={iconName} />
      </Attention>
    </Pressable>
  ),
);
