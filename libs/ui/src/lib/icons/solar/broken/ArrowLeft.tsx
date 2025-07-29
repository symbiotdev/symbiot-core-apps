import Svg, { Path } from 'react-native-svg';
import { IconProps } from '../../config';

export const ArrowLeft = (props: IconProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M4 12L10 6M4 12L10 18M4 12H14.5M20 12H17.5"
      stroke={props.color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
