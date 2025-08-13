import Svg, { Path } from 'react-native-svg';
import { IconProps } from '../../icon-props';

export const ArrowRight = (props: IconProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M4 12H6.5M20 12L14 6M20 12L14 18M20 12H9.5"
      stroke={props.color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
