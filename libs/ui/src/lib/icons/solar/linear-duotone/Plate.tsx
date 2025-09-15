import Svg, { Path } from 'react-native-svg';
import { IconProps } from '../../icon-props';

export const Plate = (props: IconProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      opacity={0.5}
      d="M15 4.00092C18.1143 4.01003 19.7653 4.10846 20.8284 5.17156C22 6.34313 22 8.22875 22 12C22 15.7712 22 17.6568 20.8284 18.8284C19.6569 20 17.7712 20 14 20H10C6.22876 20 4.34315 20 3.17157 18.8284C2 17.6568 2 15.7712 2 12C2 8.22875 2 6.34313 3.17157 5.17156C4.23467 4.10846 5.8857 4.01003 9 4.00092"
      stroke={props.color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    <Path
      d="M12 5L12 3"
      stroke={props.color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    <Path
      d="M8 10.5H16"
      stroke={props.color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    <Path
      d="M8 14H13.5"
      stroke={props.color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  </Svg>
);
