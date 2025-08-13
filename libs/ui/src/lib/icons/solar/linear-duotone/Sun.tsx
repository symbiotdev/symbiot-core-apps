import Svg, { Circle, Path } from 'react-native-svg';
import { IconProps } from '../../icon-props';

export const Sun = (props: IconProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Circle cx={12} cy={12} r={6} stroke={props.color} strokeWidth={1.5} />
    <Path
      d="M12 2V3"
      stroke={props.color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    <Path
      d="M12 21V22"
      stroke={props.color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    <Path
      d="M22 12L21 12"
      stroke={props.color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    <Path
      d="M3 12L2 12"
      stroke={props.color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    <Path
      opacity={0.5}
      d="M19.0708 4.9292L18.678 5.32204"
      stroke={props.color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    <Path
      opacity={0.5}
      d="M5.32178 18.6782L4.92894 19.0711"
      stroke={props.color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    <Path
      opacity={0.5}
      d="M19.0708 19.0708L18.678 18.678"
      stroke={props.color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    <Path
      opacity={0.5}
      d="M5.32178 5.32178L4.92894 4.92894"
      stroke={props.color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  </Svg>
);
