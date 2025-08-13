import Svg, { Path } from 'react-native-svg';
import { IconProps } from '../../icon-props';

export const Maximize = (props: IconProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M9 15L2 22M2 22H7.85714M2 22V16.1429"
      stroke={props.color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M15 9L22 2M22 2H16.1429M22 2V7.85714"
      stroke={props.color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
