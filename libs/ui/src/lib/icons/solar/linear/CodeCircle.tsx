import Svg, { Path } from 'react-native-svg';
import { IconProps } from '../../icon-props';

export const CodeCircle = (props: IconProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
      stroke={props.color}
      strokeWidth={1.5}
    />
    <Path
      d="M15.5 9L15.6716 9.17157C17.0049 10.5049 17.6716 11.1716 17.6716 12C17.6716 12.8284 17.0049 13.4951 15.6716 14.8284L15.5 15"
      stroke={props.color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    <Path
      d="M13.2941 7.17041L12 12L10.7059 16.8297"
      stroke={props.color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    <Path
      d="M8.49994 9L8.32837 9.17157C6.99504 10.5049 6.32837 11.1716 6.32837 12C6.32837 12.8284 6.99504 13.4951 8.32837 14.8284L8.49994 15"
      stroke={props.color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  </Svg>
);
