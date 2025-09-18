import Svg, { Line } from 'react-native-svg';
import { IconProps } from '../../icon-props';

export const Close = (props: IconProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24">
    <Line
      x1="6"
      y1="6"
      x2="18"
      y2="18"
      stroke={props.color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Line
      x1="18"
      y1="6"
      x2="6"
      y2="18"
      stroke={props.color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);
