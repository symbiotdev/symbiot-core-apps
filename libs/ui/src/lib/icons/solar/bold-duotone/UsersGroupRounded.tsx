import Svg, { Circle, Ellipse } from 'react-native-svg';
import { IconProps } from '../../icon-props';

export const UsersGroupRounded = (props: IconProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Circle opacity={0.4} cx={15} cy={6} r={3} fill={props.color} />
    <Ellipse opacity={0.4} cx={16} cy={17} rx={5} ry={3} fill={props.color} />
    <Circle cx={9.00098} cy={6} r={4} fill={props.color} />
    <Ellipse cx={9.00098} cy={17.001} rx={7} ry={4} fill={props.color} />
  </Svg>
);
