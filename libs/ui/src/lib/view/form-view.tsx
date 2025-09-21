import { View, ViewProps } from 'tamagui';
import { ViewStyle } from 'react-native';

export const formViewStyles: ViewStyle = {
  alignSelf: 'center',
  width: '100%',
  maxWidth: 600,
};

// fixme: find out better name
export const FormView = ({ style, gap, ...props }: ViewProps) => {
  return <View style={[formViewStyles, style]} gap={gap || 10} {...props} />;
};
