import Svg, { Circle, Path } from 'react-native-svg';
import { IconProps } from '../../icon-props';

export const TuningSquare = (props: IconProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12Z"
      stroke={props.color}
      strokeWidth={1.5}
    />
    <Circle cx={8} cy={10} r={2} stroke={props.color} strokeWidth={1.5} />
    <Circle
      r={2}
      transform="matrix(1 0 0 -1 16 14)"
      stroke={props.color}
      strokeWidth={1.5}
    />
    <Path
      d="M8 14V19"
      stroke={props.color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    <Path
      d="M16 10V5"
      stroke={props.color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    <Path
      d="M8 5V6"
      stroke={props.color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    <Path
      d="M16 19V18"
      stroke={props.color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  </Svg>
);
