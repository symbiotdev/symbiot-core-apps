import { View, ViewProps } from 'tamagui';
import { ViewStyle } from 'react-native';

export const compactViewStyles: ViewStyle = {
  alignSelf: 'center',
  width: '100%',
  maxWidth: 600,
};

export const CompactView = ({ style, gap, ...props }: ViewProps) => {
  return <View style={[compactViewStyles, style]} gap={gap || 10} {...props} />;
};
