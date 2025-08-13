import Svg, { Circle, Path } from 'react-native-svg';
import { IconProps } from '../../icon-props';

export const UserCircle = (props: IconProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Circle
      opacity={0.5}
      cx={12}
      cy={9}
      r={3}
      stroke={props.color}
      strokeWidth={1.5}
    />
    <Circle cx={12} cy={12} r={10} stroke={props.color} strokeWidth={1.5} />
    <Path
      opacity={0.5}
      d="M17.9691 20C17.81 17.1085 16.9247 15 11.9999 15C7.07521 15 6.18991 17.1085 6.03076 20"
      stroke={props.color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  </Svg>
);
