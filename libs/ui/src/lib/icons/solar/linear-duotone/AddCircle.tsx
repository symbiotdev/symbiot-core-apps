import Svg, { Circle, Path } from 'react-native-svg';
import { IconProps } from '../../config';

export const AddCircle = (props: IconProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Circle
      opacity={0.5}
      cx={12}
      cy={12}
      r={10}
      stroke={props.color}
      strokeWidth={1.5}
    />
    <Path
      d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15"
      stroke={props.color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  </Svg>
);
