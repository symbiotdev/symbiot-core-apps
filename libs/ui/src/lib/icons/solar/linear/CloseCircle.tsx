import Svg, { Circle, Path } from 'react-native-svg';
import { IconProps } from '../../icon-props';

export const CloseCircle = (props: IconProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Circle cx={12} cy={12} r={10} stroke={props.color} strokeWidth={1.5} />
    <Path
      d="M14.5 9.49999L9.5 14.5M9.49998 9.49997L14.5 14.4999"
      stroke={props.color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  </Svg>
);
