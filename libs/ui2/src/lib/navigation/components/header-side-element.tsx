import { memo, PropsWithChildren } from 'react';
import { View, ViewStyle } from 'react-native';
import { GlassView } from '../../glass/glass-view';

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
          style={{
            flexDirection: 'row',
            flexShrink: 1,
            zIndex: 1,
            minWidth: 40,
            minHeight: 40,
            borderRadius: 20,
          }}
        >
          {children}
        </GlassView>
      )}
    </View>
  ),
);
