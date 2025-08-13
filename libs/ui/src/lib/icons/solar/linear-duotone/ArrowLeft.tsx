import Svg, { Path } from 'react-native-svg';
import { IconProps } from '../../icon-props';

export const ArrowLeft = (props: IconProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      opacity={0.5}
      d="M20 12.75C20.4142 12.75 20.75 12.4142 20.75 12C20.75 11.5858 20.4142 11.25 20 11.25V12.75ZM20 11.25H4V12.75H20V11.25Z"
      fill={props.color}
    />
    <Path
      d="M10 6L4 12L10 18"
      stroke={props.color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
