import Svg, { Path } from 'react-native-svg';
import { IconProps } from '../../icon-props';

export const ArrowToTopLeft = (props: IconProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M17 9.5L12 4.5L7 9.5"
      stroke={props.color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 4.5C12 4.5 12 12.8333 12 14.5C12 16.1667 11 19.5 7 19.5"
      stroke={props.color}
      strokeWidth={1.5}
      strokeLinecap="round"
      opacity={0.5}
    />
  </Svg>
);
