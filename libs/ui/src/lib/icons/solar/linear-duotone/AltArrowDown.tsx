import Svg, { Path } from 'react-native-svg';
import { IconProps } from '../../config';

export const AltArrowDown = (props: IconProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M19 9L12 15L5 9"
      stroke={props.color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
