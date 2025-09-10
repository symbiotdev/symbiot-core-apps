import Svg, { Path } from 'react-native-svg';
import { IconProps } from '../../icon-props';

export const Import = (props: IconProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12"
      stroke={props.color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    <Path
      d="M12 4L12 14M12 14L15 11M12 14L9 11"
      stroke={props.color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
