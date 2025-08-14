import Svg, { Path } from 'react-native-svg';
import { IconProps } from '../../icon-props';

export const Code = (props: IconProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M17 7.82959L18.6965 9.35641C20.239 10.7447 21.0103 11.4389 21.0103 12.3296C21.0103 13.2203 20.239 13.9145 18.6965 15.3028L17 16.8296"
      stroke={props.color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    <Path
      d="M13.9868 5L12 12.4149L10.0132 19.8297"
      stroke={props.color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    <Path
      d="M6.99999 7.82959L5.30352 9.35641C3.76096 10.7447 2.98969 11.4389 2.98969 12.3296C2.98969 13.2203 3.76096 13.9145 5.30352 15.3028L6.99999 16.8296"
      stroke={props.color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  </Svg>
);
