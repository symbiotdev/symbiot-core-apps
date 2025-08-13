import Svg, { Circle, Path } from 'react-native-svg';
import { IconProps } from '../../icon-props';

export const UserCircle = (props: IconProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Circle cx={12} cy={9} r={3} stroke={props.color} strokeWidth={1.5} />
    <Circle cx={12} cy={12} r={10} stroke={props.color} strokeWidth={1.5} />
    <Path
      d="M17.9692 20C17.8101 17.1085 16.9248 15 12 15C7.07527 15 6.18997 17.1085 6.03082 20"
      stroke={props.color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  </Svg>
);
