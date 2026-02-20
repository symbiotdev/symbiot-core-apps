import { memo, PropsWithChildren } from 'react';
import { ViewStyle } from 'react-native';
import { View } from 'tamagui';
import { GlassView } from '@symbiot-core-apps/ui2';

export const HeaderSideElement = memo(
  ({
    style,
    children,
    alignItems,
  }: PropsWithChildren<{
    style?: Omit<ViewStyle, 'alignItems'>;
    alignItems: ViewStyle['alignItems'];
  }>) => (
    <View style={{ width: 80, alignItems, ...style }}>
      {children && (
        <GlassView
          interactive
          children={children}
          style={{
            zIndex: 1,
            minWidth: 40,
            minHeight: 40,
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
