import { View } from 'react-native';
import { themed } from './themed';

export const YDiv = themed(View);
export const XDiv = themed(View, {
  flexDirection: 'row',
});
