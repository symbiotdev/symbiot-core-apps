import { memo, PropsWithChildren } from 'react';
import { ViewStyle } from 'react-native';
import { GlassView } from '@symbiot-core-apps/ui';
import { View } from 'tamagui';

export const HeaderSideElement = memo(
  ({
    style,
    children,
    alignItems,
  }: PropsWithChildren<{
    style?: Omit<ViewStyle, 'alignItems'>;
    alignItems: ViewStyle['alignItems'];
  }>) => (
    <View style={{ width: 80, minHeight: 40, alignItems, ...style }}>
      {children && (
        <GlassView
          interactive
          children={children}
          style={{
            zIndex: 1,
            minWidth: 40,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 20,
          }}
        />
      )}
    </View>
  ),
);
