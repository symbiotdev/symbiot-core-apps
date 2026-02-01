import Svg, { Circle, Path } from 'react-native-svg';
import { IconProps } from '../../icon-props';

export const ClockCircle = (props: IconProps) => (
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
      d="M12 8V12L14.5 14.5"
      stroke={props.color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
