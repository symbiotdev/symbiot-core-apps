import { View, ViewProps } from 'tamagui';
import { ViewStyle } from 'react-native';

export const formViewStyles: ViewStyle = {
  marginHorizontal: 'auto',
  width: '100%',
  maxWidth: 600,
  gap: 10,
};

// fixme: find out better name
export const FormView = (props: ViewProps) => {
  return <View {...props} style={[formViewStyles, props.style]} />;
};
