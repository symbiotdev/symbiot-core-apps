import Svg, { Path } from 'react-native-svg';
import { IconProps } from '../../icon-props';

export const Import = (props: IconProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M12 4L12 14M12 14L15 11M12 14L9 11"
      stroke={props.color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 20C7.58172 20 4 16.4183 4 12M20 12C20 14.5264 18.8289 16.7792 17 18.2454"
      stroke={props.color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  </Svg>
);
