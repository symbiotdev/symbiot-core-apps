import Svg, { Circle, Ellipse } from 'react-native-svg';
import { IconProps } from '../../icon-props';

export const UserRounded = (props: IconProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Circle cx={12} cy={6} r={4} stroke={props.color} strokeWidth={1.5} />
    <Ellipse
      cx={12}
      cy={17}
      rx={7}
      ry={4}
      stroke={props.color}
      strokeWidth={1.5}
    />
  </Svg>
);
