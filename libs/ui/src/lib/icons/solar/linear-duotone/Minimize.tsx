import Svg, { Path } from 'react-native-svg';
import { IconProps } from '../../icon-props';

export const Minimize = (props: IconProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      opacity={0.6}
      d="M2 22L9 15M9 15H3.14286M9 15V20.8571"
      stroke={props.color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M22 2L15 9M15 9H20.8571M15 9V3.14286"
      stroke={props.color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
