import Svg, { Path } from 'react-native-svg';
import { IconProps } from '../../icon-props';

export const AltArrowLeft = (props: IconProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M15 19L9 12L10.5 10.25M15 5L13 7.33333"
      stroke={props.color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
