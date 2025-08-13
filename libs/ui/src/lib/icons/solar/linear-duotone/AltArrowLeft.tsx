import Svg, { Circle, Path } from 'react-native-svg';
import { IconProps } from '../../icon-props';

export const AltArrowLeft = (props: IconProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Circle
      cx={12}
      cy={12}
      r={10}
      stroke={props.color}
      strokeWidth={1.5}
      opacity={0.5}
    />
    <Path
      d="M13.5 9L10.5 12L13.5 15"
      stroke={props.color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
