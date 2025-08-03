import Svg, { Path } from 'react-native-svg';
import { IconProps } from '../../config';

export const AltArrowUp = (props: IconProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M19 15L12 9L5 15"
      stroke={props.color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
