import Svg, { Path } from 'react-native-svg';
import { IconProps } from '../../icon-props';

export const AltArrowRight = (props: IconProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M9 5L15 12L9 19"
      stroke={props.color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
