import Svg, { Circle, Path } from 'react-native-svg';
import { IconProps } from '../../icon-props';

export const InfoCircle = (props: IconProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Circle cx={12} cy={12} r={10} stroke={props.color} strokeWidth={1.5} />
    <Path
      d="M12 17V11"
      stroke={props.color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    <Circle r={1} transform="matrix(1 0 0 -1 12 8)" fill={props.color} />
  </Svg>
);
