import Svg, { Path } from 'react-native-svg';
import { IconProps } from '../../icon-props';

export const ArrowRight = (props: IconProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      opacity={0.5}
      d="M4 11.25C3.58579 11.25 3.25 11.5858 3.25 12C3.25 12.4142 3.58579 12.75 4 12.75V11.25ZM4 12.75H20V11.25H4V12.75Z"
      fill={props.color}
    />
    <Path
      d="M14 6L20 12L14 18"
      stroke={props.color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
