import Svg, { Circle, Path } from 'react-native-svg';
import { IconProps } from '../../config';

export const QuestionCircle = (props: IconProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Circle
      opacity={0.5}
      cx={12}
      cy={12}
      r={10}
      stroke={props.color}
      strokeWidth={1.5}
    />
    <Path
      d="M10.125 8.875C10.125 7.83947 10.9645 7 12 7C13.0355 7 13.875 7.83947 13.875 8.875C13.875 9.56245 13.505 10.1635 12.9534 10.4899C12.478 10.7711 12 11.1977 12 11.75V13"
      stroke={props.color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    <Circle cx={12} cy={16} r={1} fill={props.color} />
  </Svg>
);
