
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
export const Logout = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4"
      stroke={props.color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    <Path
      d="M10 12H20M20 12L17 9M20 12L17 15"
      stroke={props.color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

