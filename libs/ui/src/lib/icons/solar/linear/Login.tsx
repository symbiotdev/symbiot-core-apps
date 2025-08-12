import Svg, { Path } from 'react-native-svg';
import { IconProps } from '../../config';

export const Login = (props: IconProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4"
      stroke={props.color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    <Path
      d="M4 12H14M14 12L11 9M14 12L11 15"
      stroke={props.color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
