import { View, ViewProps } from 'react-native';

export const Attention = ({
  active,
  size = 5,
  dotOffset = -2,
  style,
  children,
  ...props
}: ViewProps & {
  active: boolean;
  size?: number;
  dotOffset?: number;
}) => (
  <View {...props} style={[style, { position: 'relative' }]}>
    {active && (
      <View
        style={{
          position: 'absolute',
          pointerEvents: 'none',
          backgroundColor: 'orange', // fixme - colorize
          width: size,
          height: size,
          right: dotOffset,
          top: dotOffset,
          borderRadius: 50,
        }}
      />
    )}

    {children}
  </View>
);
