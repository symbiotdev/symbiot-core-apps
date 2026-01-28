import { View, ViewProps } from 'tamagui';
import { ViewStyle } from 'react-native';

export const frameViewStyles: ViewStyle = {
  alignSelf: 'center',
  width: '100%',
  maxWidth: 600,
};

export const FrameView = ({ style, gap, ...props }: ViewProps) => {
  return <View style={[frameViewStyles, style]} gap={gap || 10} {...props} />;
};
