import Svg, { Circle, Path } from 'react-native-svg';
import { IconProps } from '../../icon-props';

export const MenuDotsCircle = (props: IconProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M7.99988 12H8.00889M12.0044 12H12.0134M15.9909 12H15.9999"
      stroke={props.color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx={12} cy={12} r={10} stroke={props.color} strokeWidth={1.5} />
  </Svg>
);
