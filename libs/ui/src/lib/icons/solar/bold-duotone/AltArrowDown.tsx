import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';

export const AltArrowDown = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M8.30273 12.4044L11.6296 15.8351C11.8428 16.0549 12.1573 16.0549 12.3704 15.8351L18.8001 9.20467C19.2013 8.79094 18.9581 8 18.4297 8H12.7071L8.30273 12.4044Z"
      fill={props.color}
    />
    <Path
      opacity={0.5}
      d="M11.2929 8H5.5703C5.04189 8 4.79869 8.79094 5.1999 9.20467L7.60648 11.6864L11.2929 8Z"
      fill={props.color}
    />
  </Svg>
);
