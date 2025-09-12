import Svg, { Circle, Path } from 'react-native-svg';
import { IconProps } from '../../icon-props';

export const Magnifer = (props: IconProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Circle cx={11.5} cy={11.5} r={9.5} stroke="#8E93A6" strokeWidth={1.5} />
    <Path
      d="M18.5 18.5L22 22"
      stroke={props.color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  </Svg>
);
