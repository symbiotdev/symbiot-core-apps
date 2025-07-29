import Svg, { Path } from 'react-native-svg';
import { IconProps } from '../../config';

export const Unread = (props: IconProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M7 12.9L10.1429 16.5L18 7.5"
      stroke={props.color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
