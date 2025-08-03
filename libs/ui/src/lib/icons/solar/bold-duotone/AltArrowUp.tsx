import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';

export const AltArrowUp = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M8.30273 11.5956L11.6296 8.16485C11.8428 7.94505 12.1573 7.94505 12.3704 8.16485L18.8001 14.7953C19.2013 15.2091 18.9581 16 18.4297 16H12.7071L8.30273 11.5956Z"
      fill={props.color}
    />
    <Path
      opacity={0.5}
      d="M11.2929 15.9999H5.5703C5.04189 15.9999 4.79869 15.2089 5.1999 14.7952L7.60648 12.3135L11.2929 15.9999Z"
      fill={props.color}
    />
  </Svg>
);
